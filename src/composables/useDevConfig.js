/**
 * useDevConfig — hidrata siteConfig (reactive en DEV) desde localStorage + File System live (manual)
 * Dos JSON: base (src/config/site.config.js, inmutable) y live (src/config/site.live.json o src/data/site.live.json, persistido en disco via File System Access)
 * Guardado manual (no autosave a disco). Reset solo borra localStorage.
 */
import { watch, toRaw, ref, computed } from "vue";
import { siteConfig } from "@/config/site.config";
import { storageGet, storageSet } from "@/composables/useStorage";
import { validateConfig } from "@/config/validate";
import { canUseFS, idbGet, idbSet, idbDel, verifyPermission, pickOpen, pickSave, readJSON, writeJSON } from "@/composables/useFileSystem";

const STORAGE_KEY = "siteConfig";
const HANDLE_KEY = "siteConfigHandle";

let _instance = null;
let _original = null;

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/** True si `json` es un siteConfig estructuralmente válido (shape + validateConfig). */
export function isValidSiteConfig(json) {
  if (!json || typeof json !== "object" || Array.isArray(json)) return false;
  if (!json.site || !json.theme || !Array.isArray(json.sections)) return false;
  return validateConfig(json).length === 0;
}

/** Compara dos objetos y devuelve paths de los valores distintos (máx `limit`). */
function diffPaths(a, b, limit = 40) {
  const out = [];
  function walk(aa, bb, path) {
    if (out.length >= limit) return;
    if (aa === bb) return;
    const aIsObj = aa && typeof aa === "object";
    const bIsObj = bb && typeof bb === "object";
    if (aIsObj && bIsObj && !Array.isArray(aa) && !Array.isArray(bb)) {
      const keys = new Set([...Object.keys(aa), ...Object.keys(bb)]);
      for (const k of keys) walk(aa[k], bb[k], path ? `${path}.${k}` : k);
      return;
    }
    if (Array.isArray(aa) || Array.isArray(bb)) {
      out.push(`${path || "<root>"} [array]`);
      return;
    }
    out.push(path || "<root>");
  }
  walk(a, b, "");
  return out;
}

export function useDevConfig() {
  if (_instance) return _instance;
  if (!import.meta.env.DEV) {
    const noop = () => {};
    const noAsync = async () => {};
    _instance = {
      state: siteConfig,
      errors: () => [],
      reset: noop,
      exportAsJs: () => "",
      downloadSiteConfig: noop,
      pickLiveFile: noAsync,
      saveToDisk: noAsync,
      saveAs: noAsync,
      forgetHandle: noAsync,
      hasHandle: ref(false),
      handleName: ref(""),
      canUseFS: false,
      isSaving: ref(false),
    };
    return _instance;
  }

  _original = clone(toRaw(siteConfig));

  const state = siteConfig;
  const hasHandle = ref(false);
  const handleName = ref("");
  const isSaving = ref(false);
  let fileHandle = null;

  // Aplica `data` al estado SOLO si es un siteConfig válido (shape + validateConfig).
  const applyToState = (data) => {
    if (!data || typeof data !== "object" || Array.isArray(data)) return false;
    if (!data.layout) data.layout = clone(_original.layout);
    if (!data.order) data.order = clone(_original.order);
    if (!data.navigation) data.navigation = clone(_original.navigation);
    if (!isValidSiteConfig(data)) return false;
    Object.keys(state).forEach((k) => delete state[k]);
    Object.assign(state, data);
    storageSet(STORAGE_KEY, clone(data));
    return true;
  };

  // Hidratar desde File System live si existe, sino localStorage (siempre validando)
  (async () => {
    if (!canUseFS()) {
      // fallback solo localStorage
      const stored = storageGet(STORAGE_KEY, null);
      if (stored && typeof stored === "object" && !applyToState(stored)) {
        console.warn("[dev] dev:siteConfig en localStorage es inválido; se descarta y se usa la base.", stored);
      }
      return;
    }
    try {
      const h = await idbGet(HANDLE_KEY);
      if (h && (await verifyPermission(h, "read"))) {
        fileHandle = h;
        hasHandle.value = true;
        handleName.value = h.name || "";
        try {
          const live = await readJSON(h);
          if (applyToState(live)) return;
          // Archivo live inválido → descartar handle y usar base (evita página en blanco)
          console.warn("[dev] Archivo live de siteConfig inválido, se descarta el handle:", live);
        } catch (_e) {
          void _e;
        }
        fileHandle = null;
        hasHandle.value = false;
        handleName.value = "";
        await idbDel(HANDLE_KEY);
      }
    } catch (_e) {
      void _e;
    }
    // fallback localStorage si no hay handle o lectura falló
    const stored = storageGet(STORAGE_KEY, null);
    if (stored && typeof stored === "object" && !applyToState(stored)) {
      console.warn("[dev] dev:siteConfig en localStorage es inválido; se descarta y se usa la base.", stored);
    }
  })();

  const errors = () => validateConfig(toRaw(state));

  let timer = null;
  // Fuente = objeto reactivo (siteConfig) → rastrea cambios profunfos; toRaw() solo en el callback
  watch(
    state,
    () => {
      clearTimeout(timer);
      timer = setTimeout(() => storageSet(STORAGE_KEY, clone(toRaw(state))), 180);
    },
    { deep: true },
  );

  function reset() {
    const fresh = clone(_original);
    Object.keys(state).forEach((k) => delete state[k]);
    Object.assign(state, fresh);
    storageSet(STORAGE_KEY, clone(fresh));
    // No toca disco (solo localStorage) por requerimiento
  }

  function exportAsJs() {
    const raw = JSON.stringify(toRaw(state), null, 2);
    return `/**\n * CENTRO DE CONFIGURACIÓN — CAFÉ MORALES\n * Generado por DevSidebar (localStorage v1) — ${new Date().toISOString()}\n */\nexport const siteConfig = ${raw};\n`;
  }

  /** Diff de hojas entre original (base) y estado actual — paths cambiados */
  function diffSummary() {
    return diffPaths(_original, toRaw(state), 40);
  }

  function downloadSiteConfig() {
    const content = exportAsJs();
    const blob = new Blob([content], { type: "text/javascript;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "site.config.js";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function pickLiveFile() {
    if (!canUseFS()) {
      alert("File System Access no disponible (requiere HTTPS + Chrome/Edge).");
      return;
    }
    try {
      const h = await pickOpen({
        types: [
          {
            description: "JSON",
            accept: { "application/json": [".json"] },
          },
        ],
        excludeAcceptAllOption: false,
      });
      fileHandle = h;
      hasHandle.value = true;
      handleName.value = h.name || "";
      await idbSet(HANDLE_KEY, h);
      const live = await readJSON(h);
      if (isValidSiteConfig(live)) {
        if (!live.layout) live.layout = clone(_original.layout);
        if (!live.order) live.order = clone(_original.order);
        if (!live.navigation) live.navigation = clone(_original.navigation);
        Object.keys(state).forEach((k) => delete state[k]);
        Object.assign(state, live);
        storageSet(STORAGE_KEY, clone(live));
      } else {
        console.warn("[dev] Archivo seleccionado no es un siteConfig válido; no se aplica:", live);
        fileHandle = null;
        hasHandle.value = false;
        handleName.value = "";
        await idbDel(HANDLE_KEY);
      }
    } catch (_e) {
      if (_e?.name !== "AbortError") alert("No se pudo abrir: " + _e.message);
      void _e;
    }
  }

  async function saveToDisk() {
    if (!canUseFS()) {
      alert("File System Access no disponible.");
      return;
    }
    try {
      isSaving.value = true;
      if (!fileHandle) {
        const h = await pickSave({
          suggestedName: "site.live.json",
          types: [
            {
              description: "JSON",
              accept: { "application/json": [".json"] },
            },
          ],
        });
        fileHandle = h;
        hasHandle.value = true;
        handleName.value = h.name || "";
        await idbSet(HANDLE_KEY, h);
      } else if (!(await verifyPermission(fileHandle, "readwrite"))) {
        alert("Permiso denegado para escribir.");
        return;
      }
      await writeJSON(fileHandle, toRaw(state), false);
    } catch (_e) {
      if (_e?.name !== "AbortError") alert("No se pudo guardar: " + _e.message);
      void _e;
    } finally {
      isSaving.value = false;
    }
  }

  async function saveAs() {
    if (!canUseFS()) {
      alert("File System Access no disponible.");
      return;
    }
    try {
      isSaving.value = true;
      const h = await pickSave({
        suggestedName: "site.live.json",
        types: [
          {
            description: "JSON",
            accept: { "application/json": [".json"] },
          },
        ],
      });
      fileHandle = h;
      hasHandle.value = true;
      handleName.value = h.name || "";
      await idbSet(HANDLE_KEY, h);
      await writeJSON(h, toRaw(state), false);
    } catch (_e) {
      if (_e?.name !== "AbortError") alert("No se pudo guardar: " + _e.message);
      void _e;
    } finally {
      isSaving.value = false;
    }
  }

  async function forgetHandle() {
    await idbDel(HANDLE_KEY);
    fileHandle = null;
    hasHandle.value = false;
    handleName.value = "";
  }

  _instance = {
    state,
    errors,
    isValid: () => isValidSiteConfig(toRaw(state)),
    reset,
    exportAsJs,
    diffSummary,
    downloadSiteConfig,
    pickLiveFile,
    saveToDisk,
    saveAs,
    forgetHandle,
    hasHandle: computed(() => hasHandle.value),
    handleName: computed(() => handleName.value),
    canUseFS: canUseFS(),
    isSaving,
  };
  return _instance;
}

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

  // Hidratar desde File System live si existe, sino localStorage
  (async () => {
    if (!canUseFS()) {
      // fallback solo localStorage
      const stored = storageGet(STORAGE_KEY, null);
      if (stored && typeof stored === "object") {
        if (!stored.layout) stored.layout = clone(_original.layout);
        if (!stored.order) stored.order = clone(_original.order);
        if (!stored.navigation) stored.navigation = clone(_original.navigation);
        Object.keys(state).forEach((k) => delete state[k]);
        Object.assign(state, stored);
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
          if (live && typeof live === "object" && !Array.isArray(live)) {
            // validar que parece siteConfig (tiene site/theme)
            if (live.site || live.theme) {
              if (!live.layout) live.layout = clone(_original.layout);
              if (!live.order) live.order = clone(_original.order);
              if (!live.navigation) live.navigation = clone(_original.navigation);
              Object.keys(state).forEach((k) => delete state[k]);
              Object.assign(state, live);
              // también sincroniza localStorage para fallback
              storageSet(STORAGE_KEY, clone(live));
              return;
            }
          }
        } catch (_e) {
          void _e;
        }
      }
    } catch (_e) {
      void _e;
    }
    // fallback localStorage si no hay handle o lectura falló
    const stored = storageGet(STORAGE_KEY, null);
    if (stored && typeof stored === "object") {
      if (!stored.layout) stored.layout = clone(_original.layout);
      if (!stored.order) stored.order = clone(_original.order);
      if (!stored.navigation) stored.navigation = clone(_original.navigation);
      Object.keys(state).forEach((k) => delete state[k]);
      Object.assign(state, stored);
    }
  })();

  const errors = () => validateConfig(toRaw(state));

  let timer = null;
  watch(
    () => toRaw(state),
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
      if (live && typeof live === "object") {
        if (!live.layout) live.layout = clone(_original.layout);
        if (!live.order) live.order = clone(_original.order);
        if (!live.navigation) live.navigation = clone(_original.navigation);
        Object.keys(state).forEach((k) => delete state[k]);
        Object.assign(state, live);
        storageSet(STORAGE_KEY, clone(live));
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
    reset,
    exportAsJs,
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

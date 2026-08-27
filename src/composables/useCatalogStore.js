/**
 * useCatalogStore — catálogo reactivo para DevSidebar (solo DEV)
 * Dos JSON: base (src/data/catalog.json, inmutable) y live (src/data/catalog.live.json, persistido en disco via File System Access, manual)
 * Persiste en localStorage dev:catalog + disco live (manual). Reset solo borra localStorage.
 */
import { reactive, watch, toRaw, ref, computed } from "vue";
import baseCatalog from "@/data/catalog.json";
import { storageGet, storageSet } from "@/composables/useStorage";
import { canUseFS, idbGet, idbSet, idbDel, verifyPermission, pickOpen, pickSave, readJSON, writeJSON } from "@/composables/useFileSystem";

const STORAGE_KEY = "catalog";
const HANDLE_KEY = "catalogHandle";

let _instance = null;

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function ensureIds(items) {
  return items.map((it, idx) => ({
    id: it.id || `item-${idx}`,
    name: it.name || "",
    category: it.category || "General",
    description: it.description || "",
    price: it.price || "",
    badge: it.badge || "",
    visual: it.visual || { type: "svg", name: "generic", aspect: "4 / 3", alt: "" },
    ...it,
  }));
}

export function useCatalogStore() {
  if (_instance) return _instance;
  if (!import.meta.env.DEV) {
    const noop = () => {};
    const noAsync = async () => {};
    _instance = {
      state: reactive(ensureIds(clone(baseCatalog))),
      reset: noop,
      addItem: noop,
      duplicateItem: noop,
      removeItem: noop,
      moveItem: noop,
      exportJson: () => "[]",
      downloadCatalog: noop,
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

  const hasHandle = ref(false);
  const handleName = ref("");
  const isSaving = ref(false);
  let fileHandle = null;

  const stored = storageGet(STORAGE_KEY, null);
  const initial = Array.isArray(stored) && stored.length ? ensureIds(stored) : ensureIds(clone(baseCatalog));
  const state = reactive(initial);

  // Hidratar desde live en disco si existe (src/data/catalog.live.json)
  (async () => {
    if (!canUseFS()) return;
    try {
      const h = await idbGet(HANDLE_KEY);
      if (h && (await verifyPermission(h, "read"))) {
        fileHandle = h;
        hasHandle.value = true;
        handleName.value = h.name || "";
        try {
          const live = await readJSON(h);
          if (Array.isArray(live) && live.length) {
            const normalized = ensureIds(live);
            state.splice(0, state.length, ...normalized);
            storageSet(STORAGE_KEY, clone(normalized));
          }
        } catch (_e) {
          void _e;
        }
      }
    } catch (_e) {
      void _e;
    }
  })();

  let timer = null;
  watch(
    state,
    (val) => {
      clearTimeout(timer);
      timer = setTimeout(() => storageSet(STORAGE_KEY, clone(toRaw(val))), 180);
    },
    { deep: true },
  );

  function reset() {
    const fresh = ensureIds(clone(baseCatalog));
    state.splice(0, state.length, ...fresh);
    storageSet(STORAGE_KEY, clone(fresh));
    // No toca disco (solo localStorage) por requerimiento
  }

  function addItem() {
    const id = `nuevo-${Date.now().toString(36)}`;
    state.push({
      id,
      name: "NUEVO PRODUCTO",
      category: "Café en grano",
      description: "Descripción del nuevo producto.",
      price: "S/ 0 por kilo",
      badge: "",
      visual: { type: "svg", name: "generic", aspect: "4 / 3", alt: "Nuevo producto" },
    });
  }

  function duplicateItem(index) {
    const src = clone(toRaw(state[index]));
    src.id = `${src.id}-copy-${Date.now().toString(36)}`;
    state.splice(index + 1, 0, src);
  }

  function removeItem(index) {
    state.splice(index, 1);
  }

  function moveItem(from, to) {
    if (from === to || from < 0 || to < 0 || from >= state.length || to >= state.length) return;
    const [item] = state.splice(from, 1);
    state.splice(to, 0, item);
  }

  function exportJson() {
    return JSON.stringify(toRaw(state), null, 2);
  }

  function downloadCatalog() {
    const content = exportJson();
    const blob = new Blob([content], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "catalog.json";
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
      if (Array.isArray(live) && live.length) {
        const normalized = ensureIds(live);
        state.splice(0, state.length, ...normalized);
        storageSet(STORAGE_KEY, clone(normalized));
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
          suggestedName: "catalog.live.json",
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
        suggestedName: "catalog.live.json",
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
    reset,
    addItem,
    duplicateItem,
    removeItem,
    moveItem,
    exportJson,
    downloadCatalog,
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

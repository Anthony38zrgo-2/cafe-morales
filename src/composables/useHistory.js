/**
 * useHistory — undo/redo en memoria para objetos/arrays reactivos (solo DEV)
 * Snapshot por serialización con debounce; máx `limit` estados.
 * La serialización pasa por el proxy reactivo para que el watcher trackee
 * cambios profundos (JSON.stringify dispara los getters del proxy).
 * adecuado para siteConfig (objeto) y catálogo (array).
 */
import { computed, ref, watch } from "vue";

export function useHistory(source, { limit = 50, delay = 250 } = {}) {
  const past = ref([]);
  const future = ref([]);
  const canUndo = computed(() => past.value.length > 0);
  const canRedo = computed(() => future.value.length > 0);
  const lastPush = { value: "" };
  let timer = null;

  function serialize() {
    return JSON.stringify(source);
  }

  lastPush.value = serialize();

  watch(
    () => serialize(),
    (s) => {
      if (s === lastPush.value) return;
      clearTimeout(timer);
      timer = setTimeout(() => {
        past.value.push(lastPush.value);
        if (past.value.length > limit) past.value.shift();
        future.value = [];
        lastPush.value = serialize();
      }, delay);
    },
  );

  function restore(raw) {
    const snapshot = JSON.parse(raw);
    if (Array.isArray(snapshot)) {
      source.splice(0, source.length, ...snapshot);
    } else {
      Object.keys(source).forEach((k) => delete source[k]);
      Object.assign(source, snapshot);
    }
  }

  function undo() {
    const s = past.value.pop();
    if (s == null) return false;
    future.value.push(lastPush.value);
    lastPush.value = s;
    restore(s);
    return true;
  }

  function redo() {
    const s = future.value.pop();
    if (s == null) return false;
    past.value.push(lastPush.value);
    lastPush.value = s;
    restore(s);
    return true;
  }

  function resetHistory() {
    past.value = [];
    future.value = [];
    lastPush.value = serialize();
  }

  return { canUndo, canRedo, undo, redo, resetHistory };
}

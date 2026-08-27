/**
 * useResizable — ancho sidebar arrastrable (0 deps)
 * Persiste en localStorage dev:sidebar_w
 */
import { ref, watch } from "vue";
import { storageGet, storageSet } from "@/composables/useStorage";

const STORAGE_KEY = "sidebar_w";
const MIN = 280;
const MAX = 520;
const DEFAULT = 360;

export function useResizable() {
  const width = ref(storageGet(STORAGE_KEY, DEFAULT));
  // clamp inicial
  if (width.value < MIN) width.value = MIN;
  if (width.value > MAX) width.value = MAX;

  watch(width, (v) => storageSet(STORAGE_KEY, v));

  let startX = 0;
  let startW = 0;
  let active = false;
  let pointerId = null;
  let targetEl = null;

  function onPointerDown(e) {
    active = true;
    startX = e.clientX;
    startW = width.value;
    pointerId = e.pointerId;
    targetEl = e.currentTarget;
    try {
      targetEl.setPointerCapture(pointerId);
    } catch (_e) {
      void _e;
    }
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
  }

  function onPointerMove(e) {
    if (!active) return;
    const dx = e.clientX - startX;
    let next = startW + dx;
    next = Math.max(MIN, Math.min(MAX, next));
    width.value = Math.round(next);
  }

  function onPointerUp() {
    if (!active) return;
    active = false;
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
    try {
      targetEl?.releasePointerCapture?.(pointerId);
    } catch (_e) {
      void _e;
    }
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
    window.removeEventListener("pointercancel", onPointerUp);
  }

  function handleKey(e) {
    if (e.key === "ArrowLeft") {
      width.value = Math.max(MIN, width.value - 10);
      e.preventDefault();
    } else if (e.key === "ArrowRight") {
      width.value = Math.min(MAX, width.value + 10);
      e.preventDefault();
    }
  }

  return { width, MIN, MAX, onPointerDown, handleKey };
}

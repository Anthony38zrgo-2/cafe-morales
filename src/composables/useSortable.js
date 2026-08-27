/**
 * useSortable — drag & drop por pointer events (0 deps)
 * Para reordenar sections y catalog. Soporta mouse + touch + teclado.
 */
import { ref } from "vue";

export function useSortable(listRef, onReorder) {
  const dragging = ref(null); // index
  const over = ref(null);
  const startY = ref(0);
  const startIdx = ref(-1);

  let pointerId = null;

  function startDrag(index, event) {
    dragging.value = index;
    startIdx.value = index;
    over.value = index;
    startY.value = event.clientY;
    pointerId = event.pointerId;
    if (event.target?.setPointerCapture) {
      try {
        event.target.setPointerCapture(pointerId);
      } catch (_e) {
        void _e;
      }
    }
    document.body.style.userSelect = "none";
    document.body.style.cursor = "grabbing";
  }

  function onPointerMove(event) {
    if (dragging.value == null) return;
    const y = event.clientY;
    const delta = Math.abs(y - startY.value);
    if (delta < 4) return;
    // buscar elemento bajo el puntero
    const el = document.elementFromPoint(event.clientX, y);
    const row = el?.closest?.("[data-sort-index]");
    if (row) {
      const idx = Number(row.getAttribute("data-sort-index"));
      if (!Number.isNaN(idx) && idx !== over.value) {
        over.value = idx;
        if (dragging.value !== idx) {
          // reorder inmediato visual (optimista)
          const arr = listRef.value ?? listRef;
          const actual = Array.isArray(arr) ? arr : arr.value;
          if (Array.isArray(actual)) {
            const [moved] = actual.splice(dragging.value, 1);
            actual.splice(idx, 0, moved);
            dragging.value = idx;
            if (onReorder) onReorder(actual);
          }
        }
      }
    }
  }

  function endDrag() {
    if (dragging.value == null) return;
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
    const from = startIdx.value;
    const to = dragging.value;
    dragging.value = null;
    over.value = null;
    startIdx.value = -1;
    pointerId = null;
    return { from, to };
  }

  function handleKeyMove(index, dir, total) {
    const target = index + dir;
    if (target < 0 || target >= total) return;
    const arr = listRef.value ?? listRef;
    const actual = Array.isArray(arr) ? arr : arr.value;
    if (!Array.isArray(actual)) return;
    const [moved] = actual.splice(index, 1);
    actual.splice(target, 0, moved);
    if (onReorder) onReorder(actual);
  }

  return { dragging, over, startDrag, onPointerMove, endDrag, handleKeyMove };
}

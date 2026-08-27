/**
 * useLazyTheme — lazy-load palettes/presets solo en DEV
 * En prod (vite build) todo está eager en main.css, no hace nada.
 * Usa import.meta.glob para code-split por archivo.
 */

const paletteMap = import.meta.glob("@/styles/palettes/*.css");
const presetMap = import.meta.glob("@/styles/presets/*.css");

const loaded = new Set();

/**
 * Carga perezosa de paleta (solo DEV). En prod es no-op porque main.css ya tiene todo.
 */
export async function loadPalette(id) {
  if (!import.meta.env.DEV) return;
  if (!id || id === "custom" || loaded.has(`palette:${id}`)) return;
  const key = `/src/styles/palettes/${id}.css`;
  const loader = paletteMap[key];
  if (loader) {
    try {
      await loader();
      loaded.add(`palette:${id}`);
    } catch (_e) {
      void _e;
    }
  }
}

export async function loadPreset(id) {
  if (!import.meta.env.DEV) return;
  if (!id || loaded.has(`preset:${id}`)) return;
  const key = `/src/styles/presets/${id}.css`;
  const loader = presetMap[key];
  if (loader) {
    try {
      await loader();
      loaded.add(`preset:${id}`);
    } catch (_e) {
      void _e;
    }
  }
}

export async function preloadTheme(preset, palette) {
  if (!import.meta.env.DEV) return;
  await Promise.all([loadPreset(preset), loadPalette(palette)]);
}

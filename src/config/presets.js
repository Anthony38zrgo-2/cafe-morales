/**
 * PRESETS DE ESTILO
 * Cada preset define estética global (tipografía, radios, densidad).
 * Cambiar preset = cambiar archivo en src/styles/presets/{preset}.css + data-preset.
 */
export const PRESETS = Object.freeze(["cafetal", "minimal", "vibrante"]);

export const PRESET_META = Object.freeze({
  cafetal: {
    label: "Cafetal",
    description: "Cálido y orgánico, ideal para café y productos naturales.",
    typography: "sans-display",
  },
  minimal: {
    label: "Minimal",
    description: "Limpio y profesional, para catálogos generales.",
    typography: "sans-display",
  },
  vibrante: {
    label: "Vibrante",
    description: "Audaz y contrastado, para marcas jóvenes y retail.",
    typography: "display-heavy",
  },
});

export function isValidPreset(value) {
  return PRESETS.includes(value);
}

/**
 * PALETAS CURADAS + SOPORTE CUSTOM
 * Cada paleta define 7 tokens base que alimentan @theme.
 * Si palette === "custom", se usan theme.colors del siteConfig.
 */

export const PALETTES = Object.freeze([
  "forest",
  "denim-orange",
  "earth",
  "ocean",
  "sunset",
  "graphite",
  "wine",
  "midnight",
  "sand",
  "custom",
]);

// Paletas curadas — hex verificados para contraste AA
export const PALETTE_DEFINITIONS = Object.freeze({
  forest: {
    label: "Bosque",
    description: "Verde profundo + dorado — elegante y natural.",
    colors: {
      ink: "#172033",
      muted: "#5f6878",
      surface: "#faf8f3",
      surfaceAlt: "#eef1f5",
      brand: "#234f46",
      brandDark: "#17372f",
      accent: "#d39b46",
    },
  },
  "denim-orange": {
    label: "Denim Naranja",
    description: "Azul jean + naranja — vibrante y juvenil (J&M).",
    colors: {
      ink: "#10243a",
      muted: "#607184",
      surface: "#f5f6f7",
      surfaceAlt: "#e7ebef",
      brand: "#17456d",
      brandDark: "#0c2844",
      accent: "#f47a20",
    },
  },
  earth: {
    label: "Tierra",
    description: "Marrón café + caramelo — ideal cafetalero.",
    colors: {
      ink: "#2b1d14",
      muted: "#7a6a5f",
      surface: "#fdf8f0",
      surfaceAlt: "#f0e6d8",
      brand: "#5c3d2e",
      brandDark: "#3d281e",
      accent: "#c49a6c",
    },
  },
  ocean: {
    label: "Océano",
    description: "Teal profundo + aqua — fresco y confiable.",
    colors: {
      ink: "#0f2a2e",
      muted: "#5a6e71",
      surface: "#f0f7f4",
      surfaceAlt: "#dceee8",
      brand: "#0e4d4e",
      brandDark: "#0a3636",
      accent: "#2ec4b6",
    },
  },
  sunset: {
    label: "Atardecer",
    description: "Vino + naranja cálido — acogedor y gourmet.",
    colors: {
      ink: "#2e1a1a",
      muted: "#7a5f5f",
      surface: "#fdf5f0",
      surfaceAlt: "#f5e0d3",
      brand: "#7a2e2e",
      brandDark: "#5a1f1f",
      accent: "#ff8c42",
    },
  },
  graphite: {
    label: "Grafito",
    description: "Gris azulado + acero — minimal tech.",
    colors: {
      ink: "#1a1d2e",
      muted: "#6b7280",
      surface: "#f8f9fb",
      surfaceAlt: "#e8eaef",
      brand: "#2b2d42",
      brandDark: "#1a1c2e",
      accent: "#8d99ae",
    },
  },
  wine: {
    label: "Vino",
    description: "Burdeos + dorado suave — premium y artesanal.",
    colors: {
      ink: "#2e1a22",
      muted: "#7a5f6a",
      surface: "#fdf6f0",
      surfaceAlt: "#f0e0d8",
      brand: "#4a1a2f",
      brandDark: "#2e1020",
      accent: "#d4a373",
    },
  },
  midnight: {
    label: "Medianoche",
    description: "Azul noche + celeste — moderno y nocturno.",
    colors: {
      ink: "#0f172a",
      muted: "#64748b",
      surface: "#f1f5f9",
      surfaceAlt: "#e2e8f0",
      brand: "#1e3a5f",
      brandDark: "#0f2340",
      accent: "#38bdf8",
    },
  },
  sand: {
    label: "Arena",
    description: "Beige cálido + terracota — natural y suave.",
    colors: {
      ink: "#2e2a22",
      muted: "#7a7066",
      surface: "#fdfbf7",
      surfaceAlt: "#f5ebe0",
      brand: "#8b5e3c",
      brandDark: "#6b4628",
      accent: "#d6a682",
    },
  },
});

export const CUSTOM_COLOR_KEYS = Object.freeze([
  "ink",
  "muted",
  "surface",
  "surfaceAlt",
  "brand",
  "brandDark",
  "accent",
]);

export function isValidPalette(value) {
  return PALETTES.includes(value);
}

export function getPaletteColors(paletteId) {
  return PALETTE_DEFINITIONS[paletteId]?.colors ?? null;
}

export function isHexColor(value) {
  return typeof value === "string" && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value.trim());
}

export function resolvePaletteColors(theme) {
  if (!theme) return null;
  if (theme.palette === "custom") {
    if (!theme.colors) return null;
    const missing = CUSTOM_COLOR_KEYS.filter((k) => !isHexColor(theme.colors[k]));
    if (missing.length) return null;
    return {
      ink: theme.colors.ink,
      muted: theme.colors.muted,
      surface: theme.colors.surface,
      surfaceAlt: theme.colors.surfaceAlt,
      brand: theme.colors.brand,
      brandDark: theme.colors.brandDark,
      accent: theme.colors.accent,
    };
  }
  return getPaletteColors(theme.palette);
}

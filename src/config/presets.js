/**
 * PRESETS DE ESTILO
 * Cada preset define estética global (tipografía, radios, densidad).
 * Cambiar preset = cambiar archivo en src/styles/presets/{preset}.css + data-preset.
 */
export const PRESETS = Object.freeze([
  "cafetal",
  "minimal",
  "vibrante",
  "editorial",
  "organic",
  "brutalist",
  "glass",
  "luxury",
  "retro",
  "corporate",
  "handmade",
  "mono-accent",
  "clay",
  "air",
  "paper",
  "midnight-glass",
  "solar",
  "ink",
  "editorial-soft",
  "neo-brutal",
  "bauhaus",
  "bauhaus-pastel",
]);

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
  editorial: {
    label: "Editorial",
    description: "Revista premium, serif editorial con mucho aire.",
    typography: "editorial",
  },
  organic: {
    label: "Organic",
    description: "Suave y natural, formas redondeadas y verdes.",
    typography: "organic",
  },
  brutalist: {
    label: "Brutalist",
    description: "Bloques, borde negro y sombra dura, sin radius.",
    typography: "grotesk",
  },
  glass: {
    label: "Glass",
    description: "Cristal y blur, translúcido tipo SaaS.",
    typography: "corporate",
  },
  luxury: {
    label: "Luxury",
    description: "Oro y burdeos, editorial de lujo.",
    typography: "elegant",
  },
  retro: {
    label: "Retro",
    description: "Cálido 70s, sellos y rotación leve.",
    typography: "handmade",
  },
  corporate: {
    label: "Corporate",
    description: "Tech confiable, inter tight y densidad compacta.",
    typography: "corporate",
  },
  handmade: {
    label: "Handmade",
    description: "Artesanal, serif hechos a mano y bordes irregulares.",
    typography: "handmade",
  },
  "mono-accent": {
    label: "Mono Accent",
    description: "Técnico, mono para eyebrow y números.",
    typography: "mono",
  },
  clay: {
    label: "Clay",
    description: "Barro y terracota, sombras suaves extruidas.",
    typography: "organic",
  },
  air: {
    label: "Air",
    description: "Ligero y aéreo, mucho espacio y tipografía fina.",
    typography: "corporate",
  },
  paper: {
    label: "Paper",
    description: "Papel crema, bordes sutiles y textura editorial.",
    typography: "editorial",
  },
  "midnight-glass": {
    label: "Midnight Glass",
    description: "Noche + cristal, oscuro translúcido.",
    typography: "grotesk",
  },
  solar: {
    label: "Solar",
    description: "Sol y contraste, amarillo y negro gráfico.",
    typography: "display-heavy",
  },
  ink: {
    label: "Ink",
    description: "Tinta, serif + mono, alto contraste editorial.",
    typography: "serif-mono",
  },
  "editorial-soft": {
    label: "Editorial Soft",
    description: "Suave editorial, fraunces soft y mucho aire.",
    typography: "editorial",
  },
  "neo-brutal": {
    label: "Neo Brutal",
    description: "Brutalismo neo, colores planos y borde duro.",
    typography: "grotesk",
  },
  bauhaus: {
    label: "Bauhaus",
    description: "Geométrico primario, grid 12, Poppins 700 + círculo.",
    typography: "bauhaus",
  },
  "bauhaus-pastel": {
    label: "Bauhaus Pastel",
    description: "Bauhaus suave, pastel geométrico.",
    typography: "pastel",
  },
});

export function isValidPreset(value) {
  return PRESETS.includes(value);
}

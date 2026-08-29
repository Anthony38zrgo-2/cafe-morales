/**
 * PRESETS DE ESTILO — 19 presets (consolidado 22 → 19)
 * Cada preset define estética global (tipografía, radios, densidad, modo).
 * Cambiar preset = cambiar archivo en src/styles/presets/{preset}.css + data-preset.
 * `--preset-mode` (obligatorio en el CSS) audita la firma: flat | aero | extruded | stamp | blob | glass | air | papery | mono | grid | editorial | luxury | handmade | solar | ink | organic-dashed.
 */
export const PRESETS = Object.freeze([
  "clay",
  "cafetal",
  "organic",
  "handmade",
  "vibrante",
  "bauhaus",
  "bauhaus-pastel",
  "editorial",
  "luxury",
  "retro",
  "glass",
  "brutalist",
  "solar",
  "paper",
  "ink",
  "mono-accent",
  "minimal",
  "corporate",
  "air",
]);

export const PRESET_META = Object.freeze({
  clay: {
    label: "Clay",
    description: "Barro y terracota, sombras suaves extruidas.",
    signature: "Extruido 3D suave + pill",
    family: "warm",
    typography: "organic",
  },
  cafetal: {
    label: "Cafetal",
    description: "Cálido y orgánico, ideal para café y productos naturales.",
    signature: "Dashed + sello eyebrow + Fraunces",
    family: "warm",
    typography: "sans-display",
  },
  organic: {
    label: "Organic",
    description: "Suave y natural, formas redondeadas y verdes.",
    signature: "Blob y radios generosos",
    family: "natural",
    typography: "organic",
  },
  handmade: {
    label: "Handmade",
    description: "Artesanal, serif hechos a mano y bordes irregulares.",
    signature: "Rotaciones + italic artesanal",
    family: "warm",
    typography: "handmade",
  },
  vibrante: {
    label: "Vibrante",
    description: "Audaz y contrastado, para marcas jóvenes y retail.",
    signature: "Uppercase + botón aero 3D",
    family: "bold",
    typography: "display-heavy",
  },
  bauhaus: {
    label: "Bauhaus",
    description: "Geométrico primario, grid 12, Poppins 700 + círculo.",
    signature: "Grid 12 + radius 0 + R/Y/B",
    family: "geometric",
    typography: "bauhaus",
  },
  "bauhaus-pastel": {
    label: "Bauhaus Pastel",
    description: "Bauhaus suave, pastel geométrico.",
    signature: "Geo pastel + tops tricolor",
    family: "geometric",
    typography: "pastel",
  },
  editorial: {
    label: "Editorial",
    description: "Revista premium, serif editorial con mucho aire.",
    signature: "Serif italic + bordes finos",
    family: "editorial",
    typography: "editorial",
  },
  luxury: {
    label: "Luxury",
    description: "Oro y burdeos, editorial de lujo.",
    signature: "Filetes dorados + uppercase",
    family: "editorial",
    typography: "elegant",
  },
  retro: {
    label: "Retro",
    description: "Cálido 70s, sellos y rotación leve.",
    signature: "Sellos + tilt ±0.4deg",
    family: "warm",
    typography: "handmade",
  },
  glass: {
    label: "Glass",
    description: "Cristal y blur, translúcido tipo SaaS (con *-dark = midnight-glass).",
    signature: "Backdrop-blur + translúcido",
    family: "dark-friendly",
    typography: "corporate",
  },
  brutalist: {
    label: "Brutalist",
    description: "Bloques, borde negro y sombra dura, sin radius.",
    signature: "Sombra dura 4px + borde 2px",
    family: "bold",
    typography: "grotesk",
  },
  solar: {
    label: "Solar",
    description: "Sol y contraste, amarillo y negro gráfico.",
    signature: "Pill accent + shadow 6px",
    family: "bold",
    typography: "display-heavy",
  },
  paper: {
    label: "Paper",
    description: "Papel crema, bordes sutiles y textura editorial.",
    signature: "Líneas de cuaderno + sombra 2px",
    family: "editorial",
    typography: "editorial",
  },
  ink: {
    label: "Ink",
    description: "Tinta, serif + mono, alto contraste editorial.",
    signature: "Barra accent + mono en títulos",
    family: "editorial",
    typography: "serif-mono",
  },
  "mono-accent": {
    label: "Mono Accent",
    description: "Técnico, mono para eyebrow y números.",
    signature: "Chips monos + mono tags",
    family: "tech",
    typography: "mono",
  },
  minimal: {
    label: "Minimal",
    description: "Limpio y profesional, para catálogos generales.",
    signature: "Cero sombras + 1px + compacto",
    family: "clean",
    typography: "sans-display",
  },
  corporate: {
    label: "Corporate",
    description: "Tech confiable, inter tight y densidad compacta.",
    signature: "Sora compacto + brand sólido",
    family: "tech",
    typography: "corporate",
  },
  air: {
    label: "Air",
    description: "Ligero y aéreo, mucho espacio y tipografía fina.",
    signature: "Sin cajas + línea inferior + 6rem",
    family: "clean",
    typography: "corporate",
  },
});

export function isValidPreset(value) {
  return PRESETS.includes(value);
}

/** Combos curados preset × paleta (cafetería → familia cálida recomendada) */
export const CURATED_COMBOS = Object.freeze([
  { preset: "clay", palette: "amber", label: "Ámbar × Clay", note: "Cálido y funcional · recomendado café" },
  { preset: "cafetal", palette: "earth", label: "Tierra × Cafetal", note: "Clásico cafetalero" },
  { preset: "vibrante", palette: "wine", label: "Vino × Vibrante", note: "Audaz y premium" },
  { preset: "editorial", palette: "sandstone", label: "Arenisca × Editorial", note: "Revista orgánica" },
  { preset: "glass", palette: "midnight-dark", label: "Medianoche × Glass", note: "Noche translúcida" },
  { preset: "bauhaus", palette: "forest", label: "Bosque × Bauhaus", note: "Geo con contraste" },
  { preset: "retro", palette: "sand", label: "Arena × Retro", note: "70s suave" },
  { preset: "minimal", palette: "graphite", label: "Grafito × Minimal", note: "Neutral profesional" },
  { preset: "organic", palette: "forest", label: "Bosque × Organic", note: "Eco natural" },
]);

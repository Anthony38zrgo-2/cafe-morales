# Theming — Presets y Paletas

## Presets (estética)

22 presets en `src/styles/presets/` (2 Bauhaus con Poppins, extremos priorizados):

| Preset | Uso | Tipografía | Radio | Rasgo |
|---|---|---|---|---|
| `cafetal` | Café / orgánico | sans-display (Fraunces) | xl, 1.5rem | Cálido, dashed placeholders |
| `minimal` | Negocios generales | sans-display | md, 1rem | Limpio, sin sombras |
| `vibrante` | Retail / joven | display-heavy (Barlow) | xl | Degradados aero, hover elevado |
| `editorial` | Revista premium | editorial (Fraunces) | md | Serif editorial, aire |
| `organic` | Natural blob | organic | 2xl | Blob suave, verde |
| `brutalist` | Bloques duros | grotesk | sm | Sombra dura 4px, sin radius |
| `glass` | Cristal blur | corporate | xl | Translúcido, backdrop-blur |
| `luxury` | Oro burdeos | elegant (Cormorant) | md | Borde oro, premium |
| `retro` | 70s warm | handmade | xl | Sellos rotados |
| `corporate` | Tech confiable | corporate | sm | Compacto, Inter Tight |
| `handmade` | Artesanal | handmade | 2xl | Bordes irregulares |
| `mono-accent` | Técnico | mono | sm | Mono para eyebrow |
| `clay` | Barro extruido | organic | 2xl | Sombra suave extruida |
| `air` | Ligero aéreo | corporate | md | Mucho espacio, fina |
| `paper` | Papel crema | editorial | sm | Textura papel |
| `midnight-glass` | Noche cristal | grotesk | xl | Oscuro translúcido |
| `solar` | Sol gráfico | display-heavy | md | Amarillo/negro |
| `ink` | Tinta serif+mono | serif-mono | sm | Borde tinta, mono |
| `editorial-soft` | Soft editorial | editorial | xl | Fraunces soft |
| `neo-brutal` | Neo brutal | grotesk | sm | Plano, borde duro |
| `bauhaus` | Bauhaus primario | bauhaus (Poppins) | 0 | Grid 12, 0 radius, primario R/Y/B |
| `bauhaus-pastel` | Bauhaus pastel | pastel (Poppins) | sm | Pastel geométrico |

Cambiar: `siteConfig.theme.preset = "bauhaus"` → aplica `data-preset` en `<html>`; extremos priorizados (0 radius, 2.5-6px ink, grid).

Crear nuevo preset:
1. Crea `src/styles/presets/mi-preset.css` con `[data-preset="mi-preset"] { --font-..., --radius-... }` y overrides de `.button`, `.card`, etc.
2. Importa en `src/styles/main.css`.
3. Añade a `src/config/presets.js` `PRESETS` y `PRESET_META`.
4. Valida con `node scripts/validate-config.mjs`.

## Paletas (color)

75 curadas (30 light + 30 `*-dark` + 15 `*-pastel`) + `custom` (76 total) en `src/styles/palettes/` — equilibrio pastel/dark:

Light: `forest` (default), `denim-orange`, `earth`, `ocean`, `sunset`, `graphite`, `wine`, `midnight`, `sand`, `sage`, `terracotta`, `mustard`, `plum`, `teal`, `coral`, `slate`, `amber`, `olive`, `berry`, `sky`, `mint`, `lavender`, `charcoal`, `sandstone`, `clay`, `moss`, `dusk`, `pepper`, `honey`, `indigo`.

Dark: `forest-dark`…`indigo-dark` (30) — superficies oscuras, `brand/accent` aclarados para AA.

Pastel: `sage-pastel`, `mint-pastel`, `lavender-pastel`, `sky-pastel`, `peach-pastel`, `butter-pastel`, `rose-pastel`, `clay-pastel`, `sand-pastel`, `dusk-pastel`, `teal-pastel`, `moss-pastel`, `slate-pastel`, `indigo-pastel`, `strawberry-pastel` — desaturadas `L70-80`, équilibre con dark.

Catalog `variant` ahora: `grid|list|carousel|masonry` (`carousel` scroll-snap + nav, `masonry` CSS columns). Lazy-load solo en dev (`src/composables/useLazyTheme.js` + `import.meta.glob` → `loadPalette/loadPreset` en `useTheme.js` si `DEV`).

Cada archivo define `[data-palette="id"] { --color-ink/muted/surface/surfaceAlt/brand/brandDark/accent }`.

- **Curada**: `theme.palette = "sage"`
- **Custom**: `theme.palette = "custom"` + `theme.colors = {ink,muted,surface,surfaceAlt,brand,brandDark,accent}` hex. También ajusta `site.seo.themeColor` si quieres.

Custom inyecta `style` inline vía `useTheme` — no necesitas crear CSS. Para paleta curada nueva:
1. Crea `src/styles/palettes/mi-paleta.css`.
2. Importa en `main.css`.
3. Añade a `src/config/palettes.js` `PALETTES` y `PALETTE_DEFINITIONS`.

Tokens usados por todos los componentes: `bg-brand`, `text-muted`, `bg-surface`, etc. Nunca hardcodees hex en Vue.

## Tipografía y radius

`theme.typography`: `sans-display|display-heavy|elegant|mono|editorial|grotesk|serif-mono|handmade|corporate|organic|bauhaus|pastel` (12, cada setea `--font-sans/display/serif/mono/accent` vía `useTheme.js`)
`theme.radius`: `sm|md|xl|2xl|full` — mapea a `--radius-card/button/visual` (presets pueden sobreescribir).

Fonts: 20 familias variables vía Google CDN (`Inter, Manrope, Barlow Condensed, Fraunces, Cormorant Garamond, DM Sans, Plus Jakarta Sans, Space Grotesk, Sora, Outfit, JetBrains Mono, Instrument Serif` + `Poppins, Bricolage Grotesque, Syne, Archivo, Quicksand, Comfortaa, Baloo 2, Nunito` — Poppins priorizado para Bauhaus) con `preconnect` + `display=swap` + `vite-plugin-webfont-dl` descarga `woff2` a `dist/assets` en build (offline, 80 `woff2`).

## Probar

`examples/*.json` muestra configuraciones. En dev, cambia `site.config.js` o usa DevSidebar (`Ctrl+Shift+D`) — `useTheme` aplica al instante.

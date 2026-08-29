# Theming — Presets y Paletas

## Presets (estética) — 19 consolidados

`src/config/presets.js` registra 19 presets (22 → 19: `editorial-soft` se fusionó en `editorial`, `neo-brutal` en `brutalist` y `midnight-glass` en `glass` — este último funciona con paletas `*-dark`). Cada preset **debe** declarar su firma en el CSS:

| Preset | Modo (`--preset-mode`) | Firma | Uso |
|---|---|---|---|
| `clay` | `extruded` | Extruido 3D suave + pill | Barro, terracota — **default del proyecto con paleta `amber`** |
| `cafetal` | `organic-dashed` | Dashed + sello eyebrow + Fraunces | Café / orgánico |
| `organic` | `blob` | Blob y radios generosos | Natural, verde |
| `handmade` | `handmade` | Rotaciones + italic artesanal | Artesanal |
| `vibrante` | `aero` | Uppercase + botón aero 3D | Retail joven |
| `bauhaus` | `grid` | Grid 12 + radius 0 + R/Y/B | Geométrico primario |
| `bauhaus-pastel` | `grid` | Geo pastel + tops tricolor | Bauhaus suave |
| `editorial` | `editorial` | Serif italic + bordes finos | Revista premium |
| `luxury` | `luxury` | Filetes dorados + uppercase | Lujo |
| `retro` | `stamp` | Sellos + tilt ±0.4deg | 70s warm |
| `glass` | `glass` | Backdrop-blur + translúcido | SaaS (light o dark) |
| `brutalist` | `stamp` | Sombra dura 4px + borde 2px | Bloques duros |
| `solar` | `solar` | Pill accent + shadow 6px | Sol gráfico |
| `paper` | `papery` | Líneas de cuaderno + sombra 2px | Papel crema |
| `ink` | `ink` | Barra accent + mono en títulos | Tinta serif+mono |
| `mono-accent` | `mono` | Chips monos + mono tags | Técnico |
| `minimal` | `flat` | Cero sombras + 1px + compacto | Negocios generales |
| `corporate` | `flat` | Sora compacto + brand sólido | Tech confiable |
| `air` | `air` | Sin cajas + línea inferior + 6rem | Ligero aéreo |

**Regla de firma** (`scripts/check-presets.mjs`, incluido en `npm run check`): todo preset declara `--preset-mode` (token de firma), `--font-display`, al menos un `--radius-*` y cubre ≥4 puntos de firma (`.display-title`, `.eyebrow`, `.button`, `.catalog-card`, `.visual-placeholder`, `.site-header`, `.contact-section`, `.benefits*`, `.floating-contact`, `.hero-section`, `.section-muted`, `.benefit*`). Así se evitan variantes indistinguibles: si un preset no toca esas secciones (before: contact/footer/benefits fijos para todos), los ajustes que antes eran invisibles ahora sí diferencian la página.

Cambiar: `siteConfig.theme.preset = "clay"` → aplica `data-preset` en `<html>`.

Crear nuevo preset:
1. Crea `src/styles/presets/mi-preset.css` con `[data-preset="mi-preset"]` declarando `--preset-mode`, font y radios + overrides de firma.
2. Importa en `src/styles/main.css`.
3. Añade a `src/config/presets.js` `PRESETS` y `PRESET_META` (con `signature` y `family`).
4. Valida: `node scripts/check-presets.mjs` + `npm run check`.

## Paletas (color) — 75 curadas + custom

30 light + 30 `*-dark` + 15 `*-pastel` + `custom` en `src/styles/palettes/`. Cada archivo define `[data-palette="id"] { --color-ink/muted/surface/surfaceAlt/brand/brandDark/accent }`.

- **Curada**: `theme.palette = "amber"`
- **Custom**: `theme.palette = "custom"` + `theme.colors` hex (inyecta vars vía `useTheme`)

Para paleta curada nueva:
1. Crea `src/styles/palettes/mi-paleta.css`.
2. Importa en `main.css`.
3. Añade a `src/config/palettes.js` `PALETTES` y `PALETTE_DEFINITIONS`.

## Combos curados (proyecto)

`CURATED_COMBOS` en `src/config/presets.js` — pares preset × paleta recomendados con 1 clic desde el DevSidebar (`Ámbar × Clay` es el del proyecto). `examples/*.json` documenta otros.

## Modo de edición DEV (DevSidebar — Ctrl+Shift+D)

- **Galería visual**: mini-previews en vivo (la firma de cada preset aplica sobre la maqueta) de presets y paletas; filtros por familia (`warm/bold/editorial/clean/tech/natural/geometric/dark-friendly`) y búsqueda.
- **Combos curados** + **favorito del proyecto** (☆, persistido en `dev:favorite_combo`).
- **A/B compare** (tecla `C`): foto del tema vs actual para comparar cara a cara.
- **Atajos**: `↑/↓` preset · `Shift+↑/↓` paleta · `Ctrl+Z`/`Ctrl+Y` undo/redo (máx 50 pasos en memoria) · `Ctrl+Shift+D` toggle.
- **Props editor**: formulario schema-driven (`SECTION_PROPS_SCHEMA` en `src/config/sections.js`) en vez de JSON crudo; modo "JSON" disponible como avanzado.
- **Localizar** (⌖): scroll + flash de la sección editada en la página (`data-dev-section` + outline accent).
- **Diffs vs base**: badge con nº de campos cambiados respecto a `src/config/site.config.js`.

## Probar

`npm run dev` → DevSidebar (`Ctrl+Shift+D`). `npm run check` valida config + firmas de preset + lint + test + build.

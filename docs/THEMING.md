# Theming — Presets y Paletas

## Presets (estética)

3 presets en `src/styles/presets/`:

| Preset | Uso | Tipografía | Radio | Rasgo |
|---|---|---|---|---|
| `cafetal` | Café / orgánico | sans-display (Georgia) | xl, 1.5rem | Cálido, dashed placeholders |
| `minimal` | Negocios generales | sans (Inter) | md, 1rem | Limpio, sin sombras |
| `vibrante` | Retail / joven | display-heavy (Barlow) | xl | Degradados aero, hover elevado |

Cambiar: `siteConfig.theme.preset = "minimal"` → aplica `data-preset` en `<html>`.

Crear nuevo preset:
1. Crea `src/styles/presets/mi-preset.css` con `[data-preset="mi-preset"] { --font-..., --radius-... }` y overrides de `.button`, `.card`, etc.
2. Importa en `src/styles/main.css`.
3. Añade a `src/config/presets.js` `PRESETS` y `PRESET_META`.
4. Valida con `node scripts/validate-config.mjs`.

## Paletas (color)

9 curadas + `custom` en `src/styles/palettes/`:

`forest` (default), `denim-orange`, `earth` (cafetal), `ocean`, `sunset`, `graphite`, `wine`, `midnight`, `sand`.

Cada archivo define `[data-palette="id"] { --color-ink/muted/surface/surfaceAlt/brand/brandDark/accent }`.

- **Curada**: `theme.palette = "earth"`
- **Custom**: `theme.palette = "custom"` + `theme.colors = {ink,muted,surface,surfaceAlt,brand,brandDark,accent}` hex. También ajusta `site.seo.themeColor` si quieres.

Custom inyecta `style` inline vía `useTheme` — no necesitas crear CSS. Para paleta curada nueva:
1. Crea `src/styles/palettes/mi-paleta.css`.
2. Importa en `main.css`.
3. Añade a `src/config/palettes.js` `PALETTES` y `PALETTE_DEFINITIONS`.

Tokens usados por todos los componentes: `bg-brand`, `text-muted`, `bg-surface`, etc. Nunca hardcodees hex en Vue.

## Tipografía y radius

`theme.typography`: `sans-display|display-heavy|elegant|mono`
`theme.radius`: `sm|md|xl|2xl|full` — mapea a `--radius-card/button/visual` (presets pueden sobreescribir).

## Probar

`examples/*.json` muestra configuraciones. En dev, cambia `site.config.js` y recarga — `useTheme` aplica al instante.

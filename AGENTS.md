# Guía para Codex — Plantilla Catálogo v2

## Objetivo

Plantilla Vue ultra-configurable para catálogos (cafetaleros y negocios producto). Data-driven, solo Vue+Tailwind+SVG, paletas intercambiables, presets de estilo.

## Orden de lectura

1. `README.md` y `docs/CONFIG_SCHEMA.md`
2. `src/config/site.config.js` (centro)
3. `src/data/catalog.json`
4. `docs/THEMING.md` (presets/paletas)
5. `docs/COMPONENTS.md`
6. Componentes solo si la interacción lo requiere

## Reglas

- Todo cambio de cliente debe intentarse primero en `site.config.js` (theme, navigation, sections order/variant/props) y `catalog.json`. No toques componentes si basta config.
- Paletas: usa curadas (`forest`, `earth`, etc.) o `custom` con `theme.colors` hex. No hardcodees hex en componentes.
- Visuales: `visual: {type:"svg"|"image"}` + `productImages.js` para WebP. Si no hay WebP, cae a ilustración.
- Secciones: `sections[].enabled/order/variant/props`. No edites `App.vue` para ocultar; cambia `enabled`.
- `order.enabled` controla modal WhatsApp. Si false, no renderiza botón ni modal.
- Mantén validación: `node scripts/validate-config.mjs` o `npm run check`.
- No agregues deps prod sin justificar.
- Comentarios/docs en ES, código en EN.
- Accesibilidad: aria-labelledby, role, focus, contraste.

## Verificación

```sh
npm run check
npm run build:github
npm run build:sites
```

## Finalización

- Solo secciones con `enabled:true` aparecen, en orden `order`.
- Paleta/preset correctos en `data-palette`/`data-preset`.
- Sin hex hardcode en componentes (usar `var(--color-*)`).
- 320px + desktop ok.
- Lint/test/build verdes.

# Café Morales

Café de especialidad de Jaén, Cajamarca — **migrado a plantilla v2** (`plantilla-catalogo-web-v2`). Catálogo data-driven `Vue 3 + Tailwind 4 + SVG`. Default del proyecto: **preset `clay` + paleta curada `amber`** (combo curado más funcional para café).

Migrado desde `cafe-del-monte`:
- Simplificado a `Card` genérica + `OrderModal` simple (sin `notes/body` chips ni `department` 25 deptos) — usa `deliveryLocations` v2 (Lima/Callao/Otra provincia).
- Navegación migrada a `#catalog/#about/#benefits/#contact` (v2).
- Bolsas PNG 900KB → WebP 20-30KB vía `scripts/prepare-product-image.py`.
- No se preservaron `scripts/create_marketing_brochure.py` ni `output/`.
- Tema consolidado: 19 presets con firma (`--preset-mode`) + 75 paletas + custom. DevSidebar con galería visual, combos curados, A/B y undo/redo. Ver `docs/THEMING.md`.

## Inicio rápido

```sh
npm install
npm run dev
```

## Personalización

Todo en `src/config/site.config.js` (brand, seo, contact, theme `cafetal/earth`, navigation, sections `order/variant/props`) y `src/data/catalog.json` (visual `type:"image"` + `productImages.js`).

## Comandos

```sh
npm run check          # lint + test + validate-config + check-presets + build
npm run build:github   # base /cafe-morales/ para Pages
npm run build:sites    # OpenAI Sites
node scripts/validate-config.mjs
node scripts/check-presets.mjs   # auditoría de firma y cobertura de presets
python scripts/prepare-product-image.py --input foto.jpg --output src/assets/products/id.webp
```

Plantilla base: ver `docs/THEMING.md` y `docs/COMPONENTS.md` de `plantilla-catalogo-web-v2`.

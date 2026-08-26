# Config Schema — site.config.js

Fuente: `src/config/site.schema.json` y validador `src/config/validate.js`.

## Estructura

```js
siteConfig = {
  site: { brand:{name,shortName,tagline,description}, seo:{title,description,themeColor}, contact:{phone,phoneDisplay,email,address,whatsappDefaultMessage} },
  theme: { preset, palette, colors?, typography?, radius? },
  layout: { container, sectionSpacing },
  navigation: [{label,href,section}],
  sections: [{id,enabled,order,variant,props}],
  order: {enabled, units},
}
```

## Sections

`id`: `header|hero|catalog|about|benefits|contact|footer|floating-contact`
`variant` por id:
- hero: `split|centered|highlight`
- catalog: `grid|list`
- about: `split|split-reverse|centered`
- benefits: `numbered|grid|icons`
- contact: `centered|split`

`props` libre pero validado por componente. Ej hero `props: {eyebrow,title,description,actions:[{label,href,variant}], visual:{type,name|src,aspect,alt}, highlights[]}`

## Validación

```sh
node scripts/validate-config.mjs
npm run check # incluye lint+test+build
```

Errores comunes: palette no en lista, hex no válido, section id duplicado, variant no permitida.

## Catalog

`src/data/catalog.json` array de `{id, name, category, description, price, badge, visual:{type, name|src, aspect, alt}}`

- `type:"svg"` → `name` debe existir en `SvgIllustration` o cae a `generic`
- `type:"image"` → usa `src/data/productImages.js` con WebP; si no hay, fallback SVG

## Order

`order.enabled` true muestra botón en `CatalogSection` y habilita `OrderModal` + `deliveryLocations.js`.

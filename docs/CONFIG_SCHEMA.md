# Config Schema — site.config.js

Fuente: `src/config/site.schema.json` y validador `src/config/validate.js`.

## Estructura

```js
siteConfig = {
  site: { brand:{name,shortName,tagline,description}, seo:{title,description,themeColor}, contact:{phone,phoneDisplay,email,address,whatsappDefaultMessage} },
  theme: { preset, palette, colors?, typography?, radius? },
  layout: { container, sectionSpacing },
  navigation: [{label,href,section}],
  gift: { enabled, threshold, items:[{id,label}] },
  sections: [{id,enabled,order,variant,props}],
  order: {enabled},
}
```

## Gift

Bloque top-level opcional. `enabled` activa el regalo en `OrderModal` y en el banner del catálogo;
`threshold` es el monto mínimo del pedido (más de S/ 25, por ejemplo); `items[]` son los accesorios
disponibles (`{id,label}`). Validado por `validate.js` (`gift.threshold` debe ser número > 0).

## Sections

`id`: `header|hero|catalog|ritual|partners|loyalty|about|benefits|contact|footer|floating-contact`
`variant` por id:
- hero: `split|centered|highlight`
- catalog: `grid|list|carousel|masonry`
- ritual: `centered`
- partners: `grid`
- loyalty: `grid|numbered`
- about: `split|split-reverse|centered`
- benefits: `numbered|grid|icons`
- contact: `centered|split`

`props` libre pero validado por componente. Ej hero `props: {eyebrow,title,description,actions:[{label,href,variant}], visual:{type,name|src,aspect,alt}, highlights[]}`

Nuevas secciones:
- `partners` props: `{eyebrow,title,description}` → grid `src/data/partners.js`.
- `loyalty` props: `{eyebrow,title,description,note,ctaLabel,ctaMessage,items:[{icon,title,description}]}` → Club Amigos (recurrentes).
- `hero` visual acepta `type:"model"` (`src`, `poster` para fallback SVG) vía `Hero3D`.

## Validación

```sh
node scripts/validate-config.mjs
npm run check # incluye lint+test+build
```

Errores comunes: palette no en lista, hex no válido, section id duplicado, variant no permitida.

## Catalog

`src/data/catalog.json` array de `{id, partnerId, gama, category, name, description, flags[], price, priceFrom?, badge, presentations:[{unit, price, image}], visual:{type, name|src, aspect, alt}}`

- `partnerId` referencia a un id de `src/data/partners.js` (marca mostrada en la card).
- `gama` en `clasico|premium` (filters por `category` = gama).
- `presentations[]` cada una con `unit` (ej. "250 g"), `price` numérico y `image` = clave de `productImages.js`.
- `type:"svg"` → `name` debe existir en `SvgIllustration` o cae a `generic`
- `type:"image"` → `src/data/productImages.js` con WebP; si no hay, fallback SVG

## Partners data

`src/data/partners.js` exporta `PARTNERS` (array frozen) y `PARTNER_GAMAS`:
`{ id, brand, name, logo (webp imported), founded, story, origins[], facebook }`.
Las imágenes de partners (vendedora) referenciables por clave desde `site.config.js` via
`src/data/partnerImages.js` (el config no importa assets para no romper scripts Node).

## Order

`order.enabled` true muestra botón en `CatalogSection` y habilita `OrderModal` + `deliveryLocations.js`.
Las unidades se derivan de `product.presentations` (ya no hay `order.units`).

# Componentes — v2

## Sistema data-driven

`src/config/site.config.js` define `sections[]` con `id, enabled, order, variant, props`. `src/config/sections.js` registra `SECTION_IDS` y helpers `getOrderedSections`, `getNavigationItems`, `isSectionEnabled`. `App.vue` ordena por `order` y delega a `SectionRenderer` que mapea `id → componente`.

Añadir sección:
1. Agrega id a `SECTION_IDS` y `SECTION_VARIANTS` en `sections.js`.
2. Crea `src/components/sections/NuevaSection.vue` que recibe `props` (no importa siteConfig).
3. Registra en `SectionRenderer.vue` `registry`.
4. Declara en `site.config.js` `sections` con `enabled/order/variant/props`.

## Layout

- `AppHeader.vue` props `brand, navigation` (filtrados por `getNavigationItems`). CTA WhatsApp lee `site.contact.phone`.
- `AppFooter.vue` props `brand, legal, location`.

## Secciones

- `HeroSection.vue` props `eyebrow,title,description,actions[],visual,highlights[],variant` (`split|centered|highlight`). Acciones filtradas por `isConfiguredLinkAvailable`.
- `CatalogSection.vue` props `eyebrow,title,description,emptyMessage,columns,cardVariant,showFilters,variant` (`grid|list`). Usa `catalog.json` + `PRODUCT_IMAGES` + `useCatalog` (filtros). Si `siteConfig.order.enabled` muestra botón que abre `OrderModal`.
- `AboutSection.vue` props `eyebrow,title,description,visual,variant` (`split|split-reverse|centered`).
- `BenefitsSection.vue` props `eyebrow,title,description,items[],variant` (`numbered|grid|icons` — icons usa `SvgIcon`).
- `ContactSection.vue` props `eyebrow,title,description,note,actionLabel,variant` (`centered|split`).

## UI atómicos

- `SvgIcon.vue` prop `name, size, decorative` — híbrido:
  - Registro local `src/icons/registry.js` (`currentColor`, ej. `name="whatsapp"`)
  - Iconify dinámico `name="mdi:whatsapp" | "lucide:coffee" | "heroicons:shopping-bag"` vía `@iconify/vue` (requiere `unplugin-icons` + `@iconify/json` ya configurados en `vite.config.js`)
  - Import directo optimizado (tree-shakable, sin fetch): `import IconWhatsapp from '~icons/mdi/whatsapp'` (plugin `unplugin-icons/vite`)
- `SvgIllustration.vue` prop `name, alt` — ilustraciones para placeholders.
- `MediaVisual.vue` prop `visual:{type,name|src,aspect,alt}, imageSrc, label` — unifica WebP e SVG.
- `ProductVisual.vue` wrapper de `MediaVisual` para `productImages.js`.
- `UiButton.vue` prop `label,href,variant,icon,external`
- `SectionHeader.vue` prop `eyebrow,title,description,headingId,align`
- `Card.vue` prop `title,description,category,badge,price,visual,imageSrc,aspect,actionLabel`
- `FilterGroup.vue` prop `categories,active`
- `OrderModal.vue` prop `product` — solo si `order.enabled`.
- `FloatingContact.vue` props `panelTitle,panelDescription,questions[],variant` (`panel|simple`).

## Datos

- `catalog.json`: `id` único, `visual:{type, name|src, aspect, alt}` obligatorio.
- `productImages.js`: mapa `id → import webp`. Si no existe, fallback SVG.
- `deliveryLocations.js`: provincias/distritos si `order.enabled`.

## Estilos

- `theme.css` tokens base.
- `palettes/*.css` por `data-palette`.
- `presets/*.css` por `data-preset`.
- `components.css` clases semánticas que usan `var(--color-*)` y `var(--radius-*)`.

## Contrato nuevas secciones

- id estable, `aria-labelledby`, props tipados, comentario propósito, prueba si interacción, respetar `variant`.

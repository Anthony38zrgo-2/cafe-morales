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

- `HeroSection.vue` props `eyebrow,title,description,actions[],visual,highlights[],variant` (`split|centered|highlight`). Acciones filtradas por `isConfiguredLinkAvailable`. Si `visual.type === "model"` renderiza `Hero3D` en vez de `MediaVisual`.
- `Hero3D.vue` props `visual:{src,poster,aspect,alt}, label` — three.js con import dinámico (`three` + `three/addons/loaders/GLTFLoader.js`, chunk aparte). Busca el GLB con `import.meta.glob('/src/assets/models/*.glb')`; si no existe o falla → `SvgIllustration` poster + aviso "Modelo 3D próximamente". Auto-rotación lenta (desactivada con `prefers-reduced-motion`), drag para rotar Y, wheel zoom (clamp) y touch, `ResizeObserver` + cleanup (`dispose`, `renderer.dispose()`).
- `CatalogSection.vue` props `eyebrow,title,description,emptyMessage,columns,cardVariant,showFilters,giftBanner,variant` (`grid|list|carousel|masonry`). Usa `catalog.json` + `PRODUCT_IMAGES` + `useCatalog` (filtros por categoría/gama) + filtro por partner (`FilterGroup` con `aria-label="Filtrar por partner"`). Si `siteConfig.order.enabled` muestra botón que abre `OrderModal` con payload `{product, unit, price}`. Si `giftBanner && siteConfig.gift.enabled` muestra el callout de regalos.
- `PartnersSection.vue` props `eyebrow,title,description` (`grid`) — grid de `PARTNERS` (logo, marca, "Desde {founded}", story, orígenes como chips, link Facebook).
- `LoyaltySection.vue` props `eyebrow,title,description,items[{icon,title,description}],note,ctaLabel,ctaMessage` (`grid|numbered`) — reusa `.benefits-grid`/`.benefit-icon`; CTA `UiButton` external a WhatsApp con `createWhatsAppUrl(ctaMessage)`.
- `AboutSection.vue` props `eyebrow,title,description,visual,variant` (`split|split-reverse|centered`). Si `visual.src` es clave de `partnerImages.js` (ej. `valqui-vendedora`) la resuelve a URL.
- `BenefitsSection.vue` props `eyebrow,title,description,items[],variant` (`numbered|grid|icons` — icons usa `SvgIcon`).
- `ContactSection.vue` props `eyebrow,title,description,note,actionLabel,variant` (`centered|split`).

## UI atómicos

- `SvgIcon.vue` prop `name, size, decorative` — híbrido:
  - Registro local `src/icons/registry.js` (`currentColor`, ej. `name="whatsapp"`)
  - Iconify dinámico `name="mdi:whatsapp" | "lucide:coffee" | "heroicons:shopping-bag"` vía `@iconify/vue` (requiere `unplugin-icons` + `@iconify/json` ya configurados en `vite.config.js`)
  - Import directo optimizado (tree-shakable, sin fetch): `import IconWhatsapp from '~icons/mdi/whatsapp'` (plugin `unplugin-icons/vite`)
- `SvgIllustration.vue` prop `name, alt` — ilustraciones para placeholders.
- `useScrollReveal.js` — directiva local `vReveal` (`v-reveal` en SFCs con `<script setup>`): añade `.reveal-init`, luego `.revealed` al entrar en viewport y retira las clases tras 650 ms para no interferir con hovers. Respeta `prefers-reduced-motion` (no oculta contenido) y fallback sin `IntersectionObserver`.
- `MediaVisual.vue` prop `visual:{type,name|src,aspect,alt}, imageSrc, label` — unifica WebP e SVG; `hasImage` usa `imageSrc || visual.src` como fallback.
- `ProductVisual.vue` wrapper de `MediaVisual` para `productImages.js`.
- `UiButton.vue` prop `label,href,variant,icon,external`
- `SectionHeader.vue` prop `eyebrow,title,description,headingId,align`
- `Card.vue` prop `title,description,category,badge,price,visual,imageSrc,aspect,actionLabel,actionIcon,presentations[],partnerName,partnerLogo,flags[],product` — modo multi-presentación: selector pill (`presentation-pill`), "Desde S/ X", precio del activo ("por bolsa"), flags como chips, meta de partner con mini logo. Emite `action` con `{product, unit, price}`. Sin `presentations` mantiene el comportamiento clásico.
- `FilterGroup.vue` prop `categories,active,ariaLabel` (default "Filtrar por categoría")
- `OrderModal.vue` props `product, presentation` — solo si `order.enabled`. Selección de presentación por pills (derivadas de `product.presentations`), subtotal, regalo si `subtotal >= gift.threshold` (select de `gift.items` + "Regalo por +S/25: elige el tuyo") o progreso "Te faltan S/ X para tu regalo". Mensaje vía `buildOrderMessage` (producto, presentación, cantidad, subtotal, regalo, provincia, distrito, dirección).
- `FloatingContact.vue` props `panelTitle,panelDescription,questions[],variant` (`panel|simple`).

## Datos

- `catalog.json`: `id` único, `partnerId`, `gama` (`clasico|premium`), `presentations[{unit,price,image}]`, `flags[]`, `visual:{type, name|src, aspect, alt}` obligatorio.
- `productImages.js`: mapa `clave → import webp` (claves usadas por `presentations[].image`). Si no existe, fallback SVG.
- `partners.js`: `PARTNERS` frozen + `getPartner(id)` + `PARTNER_GAMAS`.
- `partnerImages.js`: mapa `clave → import webp` de fotos de partners (referenciables desde config).
- `deliveryLocations.js`: provincias/distritos si `order.enabled`.

## Estilos

- `theme.css` tokens base.
- `palettes/*.css` por `data-palette`.
- `presets/*.css` por `data-preset`.
- `components.css` clases semánticas que usan `var(--color-*)` y `var(--radius-*)` (`.gift-banner`, `.presentation-pill`, `.flag-chip`, `.partners-grid`, `.partner-card`, `.partner-origin-chip`, `.loyalty-note`, `.hero-model-wrap`).

## Contrato nuevas secciones

- id estable, `aria-labelledby`, props tipados, comentario propósito, prueba si interacción, respetar `variant`.

# Backlog de integración de imágenes de café

## Objetivo

Integrar los assets preparados en `src/assets/coffee/` para enriquecer visualmente la página sin desplazar al producto, manteniendo la configuración data-driven, la paleta por variables CSS y el comportamiento responsive.

## Assets disponibles

| Archivo | Uso previsto | Formato |
|---|---|---|
| `coffee-beans-floating.png` | Grupo decorativo de ocho granos alrededor de la taza del hero | PNG con transparencia |
| `coffee-bean-single.png` | Acento decorativo junto al encabezado del catálogo | PNG con transparencia |
| `coffee-beans-light.webp` | Franja o columna fotográfica de Partners | WebP optimizado |
| `coffee-beans-dark.webp` | Banda fotográfica del encabezado de Club Amigos | WebP optimizado |
| `coffee-foam.webp` | Fondo del CTA de contacto/WhatsApp | WebP optimizado |

Los PNG transparentes fueron extraídos mediante edición de imagen. Los WebP conservan el encuadre de las fotografías suministradas y fueron optimizados sin ampliarlos.

## Backlog priorizado

### P0 — Registrar los assets

- Crear un mapa de imágenes decorativas, siguiendo el patrón de `src/data/partnerImages.js`, para evitar rutas o imports dispersos.
- Exponer las imágenes desde configuración mediante claves estables; no hardcodear rutas en los componentes.
- Mantener `alt=""` y `aria-hidden="true"` en adornos que no transmiten información.

### P1 — Granos flotantes en el hero

- Añadir a las props del hero un bloque decorativo opcional, por ejemplo `decoration: { src, placement, motion }`.
- Renderizar `coffee-beans-floating.png` alrededor o detrás de la taza, sin bloquear drag, zoom ni otros eventos del modelo 3D (`pointer-events: none`).
- Escritorio: colocar la columna de granos dentro del área visual, con parte del recurso cruzando sutilmente el borde del recuadro.
- Móvil: reducir el tamaño y recortar visualmente la composición; no aumentar de forma importante la altura del hero.
- Si se agrega movimiento, limitarlo a una deriva lenta de pocos píxeles y desactivarlo con `prefers-reduced-motion`.
- No reemplazar el modelo 3D ni su fallback actual.

### P1 — Espuma en el CTA de contacto

- Permitir una imagen de fondo opcional en `ContactSection` mediante props.
- Usar `coffee-foam.webp` con `background-size: cover` y foco centrado en el remolino.
- Añadir overlay mediante variables de la paleta; no introducir hex en el componente.
- Mantener el botón claro actual y comprobar contraste WCAG AA para títulos, descripción y nota.

### P2 — Banda fotográfica en Club Amigos

- Añadir `coffee-beans-dark.webp` únicamente al encabezado o a una banda superior de la sección.
- Usar un degradado/overlay oscuro para conservar legibilidad.
- Mantener las tres tarjetas claras y, en escritorio, permitir una superposición leve sobre la banda.
- En móvil, evitar que la fotografía quede detrás de toda la lista de beneficios.

### P2 — Fotografía clara en Partners

- Usar `coffee-beans-light.webp` como columna lateral o franja editorial, fuera de la tarjeta de Valqui.
- Escritorio: preferir una composición de dos columnas con la foto a la derecha.
- Móvil: usar un recorte horizontal corto antes de la tarjeta.
- Aplicar el tinte mediante `var(--color-*)`, sin modificar la fotografía en CSS con valores hex fijos.

### P3 — Grano individual en catálogo

- Usar `coffee-bean-single.png` como acento junto al encabezado, nunca sobre la foto o los controles de la tarjeta.
- Tamaño orientativo en escritorio: 80–130 px.
- Ocultarlo o reducirlo en 320 px cuando compita con el botón de filtros.
- Mantenerlo decorativo, sin texto alternativo redundante.

## Requisitos de implementación

- Intentar primero la integración mediante `src/config/site.config.js` y mapas de assets.
- Si hacen falta nuevas props, extender los esquemas de sección y sus validaciones.
- No hardcodear colores: usar `var(--color-*)`.
- Evitar `position: fixed`; las decoraciones deben permanecer contenidas en su sección.
- Usar `object-fit`, `object-position` y/o `<picture>` sin deformar las imágenes.
- Reservar dimensiones o `aspect-ratio` para evitar layout shift.
- Verificar que las decoraciones no generen scroll horizontal.
- Respetar `prefers-reduced-motion`.

## Criterios de aceptación

- El hero sigue siendo legible y operable con modelo 3D y fallback SVG.
- Ninguna decoración intercepta clic, drag, rueda o gestos táctiles.
- No hay scroll horizontal a 320 px.
- El CTA mantiene contraste AA sobre la fotografía.
- Solo se cargan imágenes correspondientes a secciones habilitadas.
- Los datos `data-palette` y `data-preset` continúan correctos.
- No hay hex nuevos hardcodeados en componentes.
- Imágenes con dimensiones reservadas y sin deformación visible.
- `npm run check`, `npm run build:github` y `npm run build:sites` terminan correctamente.

## Orden recomendado de entrega

1. Registrar mapa de assets y props configurables.
2. Implementar hero y CTA.
3. Validar escritorio, 320 px y breakpoint intermedio.
4. Implementar Club Amigos y Partners.
5. Añadir el grano individual solo si la composición aún necesita un acento.
6. Ejecutar todas las validaciones y builds.

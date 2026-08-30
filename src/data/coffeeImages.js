/**
 * COFFEE_IMAGES — mapa de imágenes decorativas de café
 * Sigue patrón de `src/data/partnerImages.js`: clave estable → import,
 * sin hardcodear rutas en componentes, usable desde `site.config.js`.
 */
import beansFloating from "@/assets/coffee/coffee-beans-floating.png";
import beanSingle from "@/assets/coffee/coffee-bean-single.png";

export const COFFEE_IMAGES = Object.freeze({
  "beans-floating": beansFloating,
  "bean-single": beanSingle,
});

export function getCoffeeImage(key) {
  return COFFEE_IMAGES[key] || "";
}

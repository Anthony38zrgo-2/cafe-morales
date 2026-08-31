/**
 * COFFEE_IMAGES — mapa de imágenes decorativas de café
 * Sigue patrón de `src/data/partnerImages.js`: clave estable → import,
 * sin hardcodear rutas en componentes, usable desde `site.config.js`.
 */
import beansFloating from "@/assets/coffee/coffee-beans-floating.png";
import beanSingle from "@/assets/coffee/coffee-bean-single.png";
import beansLight from "@/assets/coffee/coffee-beans-light.webp";
import daliaMokaPot from "@/assets/coffee/dalia-moka-pot.png";

export const COFFEE_IMAGES = Object.freeze({
  "beans-floating": beansFloating,
  "bean-single": beanSingle,
  "beans-light": beansLight,
  "dalia-moka-pot": daliaMokaPot,
});

export function getCoffeeImage(key) {
  return COFFEE_IMAGES[key] || "";
}

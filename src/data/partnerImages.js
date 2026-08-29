/**
 * PARTNER_IMAGES — imágenes de partners que pueden referenciarse por clave
 * desde site.config.js (data-driven, sin imports de assets en el config:
 * así scripts Node como validate-config.mjs siguen importando site.config.js).
 * Clave → import WebP (Vite resuelve el asset).
 */
import valquiVendedora from "@/assets/partners/valqui-vendedora.webp";

export const PARTNER_IMAGES = Object.freeze({
  "valqui-vendedora": valquiVendedora,
});

export function getPartnerImage(key) {
  return PARTNER_IMAGES[key] || "";
}

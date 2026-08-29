/**
 * PARTNERS — productores y tostadores con trayectoria que llegan al market.
 * Cada partner respalda uno o más productos del catálogo (partnerId).
 */
import valquiLogo from "@/assets/partners/valqui-logo.webp";

export const PARTNERS = Object.freeze([
  {
    id: "valqui",
    brand: "Valqui",
    name: "Café Ventura S.A.C.",
    logo: valquiLogo,
    founded: 2015,
    story:
      "Empresa peruana con más de 11 años produciendo y distribuyendo café peruano bajo las marcas Valqui y Ventura. Buscamos traer su café al mercado con información clara y precio justo.",
    origins: ["Chanchamayo", "La Merced", "Villarrica", "Cusco", "Jaén"],
    facebook: "https://www.facebook.com/cafevalqui",
  },
]);

export function getPartner(id) {
  return PARTNERS.find((p) => p.id === id) || null;
}

export const PARTNER_GAMAS = Object.freeze({ clasico: "Clásico", premium: "Premium" });

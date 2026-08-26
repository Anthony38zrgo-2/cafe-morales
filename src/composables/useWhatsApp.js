/**
 * useWhatsApp — funciones puras para construir URLs de WhatsApp
 * Centraliza phone para no duplicar en siteConfig.
 */
import { siteConfig } from "@/config/site.config";

function getPhone(config = siteConfig) {
  const raw = config?.site?.contact?.phone || "";
  return raw.replace(/\D/g, "");
}

export function createWhatsAppUrl(message, config = siteConfig) {
  const phone = getPhone(config);
  if (!phone) return `https://wa.me/?text=${encodeURIComponent(message)}`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function buildOrderMessage(order, config = siteConfig) {
  const brandName = config?.site?.brand?.name || "nuestro catálogo";
  return [
    `Hola, quisiera realizar el siguiente pedido en ${brandName}:`,
    `• Producto: ${order.product.name}`,
    `• Descripción: ${order.product.description}`,
    `• Cantidad: ${order.quantity} ${order.unit}`,
    `• Provincia: ${order.province}`,
    `• Distrito: ${order.district}`,
    `• Dirección: ${order.address.trim()}`,
    "¿Podrían confirmarme disponibilidad, precio y delivery?",
  ].join("\n");
}

export function buildDefaultMessage(config = siteConfig) {
  return config?.site?.contact?.whatsappDefaultMessage || "Hola, me interesa saber más sobre sus productos.";
}

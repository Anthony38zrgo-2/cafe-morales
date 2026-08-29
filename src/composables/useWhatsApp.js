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
  const lines = [
    `Hola, quisiera realizar el siguiente pedido en ${brandName}:`,
    `• Producto: ${order.product.name}`,
  ];
  if (order.product?.description) lines.push(`• Descripción: ${order.product.description}`);
  const unit = order.presentation?.unit || order.unit || "unidades";
  lines.push(`• Presentación: ${unit}`);
  lines.push(`• Cantidad: ${order.quantity}`);
  if (order.subtotal != null && Number.isFinite(Number(order.subtotal))) {
    lines.push(`• Subtotal: S/ ${Number(order.subtotal).toFixed(2)}`);
  }
  if (order.giftLabel) lines.push(`• Regalo: ${order.giftLabel}`);
  lines.push(`• Provincia: ${order.province}`);
  lines.push(`• Distrito: ${order.district}`);
  lines.push(`• Dirección: ${order.address.trim()}`);
  lines.push("¿Podrían confirmarme disponibilidad, precio y delivery?");
  return lines.join("\n");
}

export function buildDefaultMessage(config = siteConfig) {
  return config?.site?.contact?.whatsappDefaultMessage || "Hola, me interesa saber más sobre sus productos.";
}

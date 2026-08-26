<script setup>
/**
 * ProductVisual — wrapper para imagen WebP de producto con fallback ilustración
 * Mantiene compatibilidad con productImages.js (mapa estático Vite)
 */
import MediaVisual from "@/components/ui/MediaVisual.vue";

defineProps({
  src: { type: String, default: "" },
  visual: { type: Object, default: null },
  label: { type: String, required: true },
  aspect: { type: String, default: "4 / 3" },
});
</script>

<template>
  <MediaVisual
    :visual="visual || { type: src ? 'image' : 'svg', name: 'generic', aspect, alt: label }"
    :image-src="src"
    :label="label"
    :aspect="aspect"
    class="product-visual"
    :class="{ 'has-image': Boolean(src) }"
  />
</template>

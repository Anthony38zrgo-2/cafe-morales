<script setup>
/**
 * AboutSection — "El Market": quién lo hace y de dónde viene el café.
 * Si visual.src es una clave (ej. "valqui-vendedora") se resuelve a URL vía partnerImages.
 */
import { computed } from "vue";
import { getPartnerImage } from "@/data/partnerImages";
import MediaVisual from "@/components/ui/MediaVisual.vue";
import SectionHeader from "@/components/ui/SectionHeader.vue";

const props = defineProps({
  eyebrow: { type: String, default: "Nosotros" },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  visual: { type: Object, default: null },
  variant: { type: String, default: "split-reverse" },
});

const resolvedVisual = computed(() => {
  const visual = props.visual;
  if (visual?.type !== "image" || typeof visual.src !== "string") return visual;
  if (visual.src.startsWith("http") || visual.src.startsWith("/")) return visual;
  const url = getPartnerImage(visual.src);
  return url ? { ...visual, src: url } : visual;
});
</script>

<template>
  <section id="about" class="section-space section-muted" aria-labelledby="about-title">
    <div class="page-container split-grid" :class="variant === 'split-reverse' ? 'split-grid-reverse' : ''">
      <div>
        <SectionHeader :eyebrow="eyebrow" :title="title" :description="description" heading-id="about-title" />
      </div>
      <MediaVisual v-if="resolvedVisual" :visual="resolvedVisual" :label="title" />
    </div>
  </section>
</template>

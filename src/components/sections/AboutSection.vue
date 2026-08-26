<script setup>
import MediaVisual from "@/components/ui/MediaVisual.vue";
import SectionHeader from "@/components/ui/SectionHeader.vue";

defineProps({
  eyebrow: { type: String, default: "Nosotros" },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  visual: { type: Object, default: null },
  variant: { type: String, default: "split-reverse" },
});
</script>

<template>
  <section id="about" class="section-space section-muted" aria-labelledby="about-title">
    <div class="page-container split-grid" :class="variant === 'split-reverse' ? 'split-grid-reverse' : ''">
      <div>
        <SectionHeader :eyebrow="eyebrow" :title="title" :description="description" heading-id="about-title" />
      </div>
      <MediaVisual v-if="visual" :visual="visual" :label="title" />
    </div>
  </section>
</template>

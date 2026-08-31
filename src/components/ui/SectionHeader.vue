<script setup>
/**
 * SectionHeader — encabezado reutilizable para todas las secciones
 */
import { vReveal } from "@/composables/useScrollReveal";

defineProps({
  eyebrow: { type: String, default: "" },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  headingId: { type: String, default: "" },
  align: { type: String, default: "left" },
});
</script>

<template>
  <div v-reveal :class="align === 'center' ? 'text-center mx-auto' : ''">
    <p v-if="eyebrow" class="eyebrow" :class="align === 'center' ? 'mx-auto' : ''">{{ eyebrow }}</p>
    <h2 :id="headingId" class="section-title" :class="align === 'center' ? 'mx-auto text-center' : ''">
      {{ title }}
    </h2>
    <p v-if="description" :class="align === 'center' ? 'section-intro mx-auto text-center' : 'section-intro'">
      {{ description }}
    </p>
  </div>
</template>

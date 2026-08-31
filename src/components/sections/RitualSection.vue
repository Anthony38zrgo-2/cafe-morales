<script setup>
/**
 * RITUAL — transición breve entre catálogo y productores.
 * Reserva el modelo 3D para un momento propio y evita competir con el hero.
 */
import { computed } from "vue";
import Hero3D from "@/components/sections/Hero3D.vue";
import { getCoffeeImage } from "@/data/coffeeImages";

const props = defineProps({
  eyebrow: { type: String, default: "" },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  background: { type: String, default: "" },
  visual: { type: Object, default: null },
});

const backgroundSrc = computed(() => getCoffeeImage(props.background));
const backgroundStyle = computed(() =>
  backgroundSrc.value
    ? { "--ritual-background": `url("${backgroundSrc.value}")` }
    : {},
);
</script>

<template>
  <section
    class="ritual-section"
    :style="backgroundStyle"
    aria-labelledby="ritual-title"
  >
    <div class="page-container ritual-grid">
      <div class="ritual-copy">
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <h2 id="ritual-title" class="section-title">{{ title }}</h2>
        <p v-if="description" class="lead">{{ description }}</p>
      </div>

      <Hero3D
        v-if="visual"
        :visual="visual"
        :label="title"
        class="ritual-model"
      />
    </div>
  </section>
</template>

<script setup>
/**
 * Card — tarjeta genérica data-driven
 * Modo multi-presentación: si `presentations` trae [{unit, price, imageSrc}]
 * muestra selector de presentaciones + "Desde S/ X"; si no, comportamiento clásico.
 */
import { computed, ref } from "vue";
import MediaVisual from "@/components/ui/MediaVisual.vue";
import SvgIcon from "@/components/ui/SvgIcon.vue";
import { vReveal } from "@/composables/useScrollReveal";

const props = defineProps({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  category: { type: String, default: "" },
  badge: { type: String, default: "" },
  price: { type: String, default: "" },
  visual: { type: Object, default: null },
  imageSrc: { type: String, default: "" },
  aspect: { type: String, default: "4 / 3" },
  actionLabel: { type: String, default: "" },
  actionIcon: { type: String, default: "" },
  presentations: { type: Array, default: () => [] },
  partnerName: { type: String, default: "" },
  partnerLogo: { type: String, default: "" },
  saleUnitLabel: { type: String, default: "bolsa" },
  flags: { type: Array, default: () => [] },
  product: { type: Object, default: null },
});
defineEmits(["action"]);

const active = ref(0);
const current = computed(() => props.presentations[active.value] || null);
const showPresentationCarousel = computed(
  () => props.visual?.presentationCarousel === true && props.presentations.length > 1,
);
const resolvedImageSrc = computed(() => current.value?.imageSrc || props.imageSrc);
const resolvedVisual = computed(() => {
  if (!props.visual) return props.visual;
  return {
    ...props.visual,
    aspect: props.aspect || props.visual.aspect,
    alt: current.value?.alt || props.visual.alt || props.title,
  };
});
const fromPrice = computed(() => {
  if (!props.presentations.length) return "";
  const min = Math.min(...props.presentations.map((p) => Number(p.price) || 0));
  return Number.isFinite(min) ? `Desde S/ ${formatPrice(min)}` : "";
});

function formatPrice(n) {
  return (Number(n) || 0).toFixed(2);
}

function selectPresentation(i) {
  active.value = i;
}

function stepPresentation(direction) {
  const count = props.presentations.length;
  if (count < 2) return;
  active.value = (active.value + direction + count) % count;
}

function sendAction() {
  return {
    product: props.product,
    unit: current.value?.unit || "",
    price: current.value?.price,
  };
}
</script>

<template>
  <article v-reveal class="catalog-card">
    <div
      class="card-media-carousel"
      :class="{ 'has-presentation-carousel': showPresentationCarousel }"
      :role="showPresentationCarousel ? 'region' : undefined"
      :aria-roledescription="showPresentationCarousel ? 'carrusel' : undefined"
      :aria-label="showPresentationCarousel ? `Galería de ${title}` : undefined"
    >
      <MediaVisual :visual="resolvedVisual" :image-src="resolvedImageSrc" :label="title" :aspect="aspect" />
      <template v-if="showPresentationCarousel">
        <button
          type="button"
          class="card-media-carousel-arrow prev"
          :aria-label="`Imagen anterior de ${title}`"
          @click="stepPresentation(-1)"
        >
          ‹
        </button>
        <button
          type="button"
          class="card-media-carousel-arrow next"
          :aria-label="`Imagen siguiente de ${title}`"
          @click="stepPresentation(1)"
        >
          ›
        </button>
        <div class="card-media-carousel-dots" role="group" :aria-label="`Acabados de ${title}`">
          <button
            v-for="(presentation, index) in presentations"
            :key="presentation.unit"
            type="button"
            class="card-media-carousel-dot"
            :class="{ active: active === index }"
            :aria-label="`Mostrar acabado ${presentation.unit}`"
            :aria-pressed="active === index"
            @click="selectPresentation(index)"
          />
        </div>
        <span class="sr-only" aria-live="polite">
          Imagen {{ active + 1 }} de {{ presentations.length }}: {{ current?.unit }}
        </span>
      </template>
    </div>
    <div class="card-body">
      <div v-if="category || badge || partnerName" class="card-meta">
        <span class="card-meta-main">
          <span>{{ category }}</span>
          <img
            v-if="partnerLogo"
            :src="partnerLogo"
            :alt="partnerName"
            class="inline-block h-4 w-4 rounded-full object-cover"
          >
        </span>
        <span v-if="partnerName" class="card-meta-partner">{{ partnerName }}</span>
        <span v-if="badge">{{ badge }}</span>
      </div>
      <h3>{{ title }}</h3>
      <p v-if="description">{{ description }}</p>

      <div v-if="flags.length" class="flag-row">
        <span v-for="flag in flags" :key="flag" class="flag-chip">{{ flag }}</span>
      </div>

      <div v-if="presentations.length" class="presentation-select" role="group" :aria-label="`Opciones de ${title}`">
        <button
          v-for="(p, i) in presentations"
          :key="p.unit"
          type="button"
          class="presentation-pill"
          :class="{ active: active === i }"
          :aria-pressed="active === i"
          @click="selectPresentation(i)"
        >
          {{ p.unit }}
        </button>
      </div>

      <div class="card-price-row">
        <strong v-if="fromPrice" class="price-from">{{ fromPrice }}</strong>
        <strong v-else-if="price">{{ price }}</strong>
        <span v-if="current" class="price-current">
          S/ {{ formatPrice(current.price) }}
          <small class="block text-xs font-semibold text-muted">por {{ saleUnitLabel }}</small>
        </span>
      </div>

      <div v-if="actionLabel" class="card-actions">
        <button type="button" class="button button-primary w-full" @click="$emit('action', sendAction())">
          <span>{{ actionLabel }}</span>
          <SvgIcon v-if="actionIcon" :name="actionIcon" :size="16" class="ml-2" />
        </button>
      </div>
      <slot />
    </div>
  </article>
</template>

<script setup>
/**
 * Card — tarjeta genérica data-driven
 * Modo multi-presentación: si `presentations` trae [{unit, price, imageSrc}]
 * muestra selector de presentaciones + "Desde S/ X"; si no, comportamiento clásico.
 */
import { computed, ref } from "vue";
import MediaVisual from "@/components/ui/MediaVisual.vue";
import SvgIcon from "@/components/ui/SvgIcon.vue";

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
  flags: { type: Array, default: () => [] },
  product: { type: Object, default: null },
});
defineEmits(["action"]);

const active = ref(0);
const current = computed(() => props.presentations[active.value] || null);
const resolvedImageSrc = computed(() => current.value?.imageSrc || props.imageSrc);
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

function sendAction() {
  return {
    product: props.product,
    unit: current.value?.unit || "",
    price: current.value?.price,
  };
}
</script>

<template>
  <article class="catalog-card">
    <MediaVisual :visual="visual" :image-src="resolvedImageSrc" :label="title" :aspect="aspect" />
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

      <div v-if="presentations.length" class="presentation-select" role="group" :aria-label="`Presentaciones de ${title}`">
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
          S/ {{ formatPrice(current.price) }}<small class="block text-xs font-semibold text-muted">por bolsa</small>
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

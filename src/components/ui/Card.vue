<script setup>
/**
 * Card — tarjeta genérica data-driven
 */
import MediaVisual from "@/components/ui/MediaVisual.vue";
import SvgIcon from "@/components/ui/SvgIcon.vue";

defineProps({
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
});
defineEmits(["action"]);
</script>

<template>
  <article class="catalog-card">
    <MediaVisual :visual="visual" :image-src="imageSrc" :label="title" :aspect="aspect" />
    <div class="card-body">
      <div v-if="category || badge" class="card-meta">
        <span>{{ category }}</span><span v-if="badge">{{ badge }}</span>
      </div>
      <h3>{{ title }}</h3>
      <p v-if="description">{{ description }}</p>
      <strong v-if="price">{{ price }}</strong>
      <div v-if="actionLabel" class="card-actions">
        <button type="button" class="button button-primary w-full" @click="$emit('action')">
          <span>{{ actionLabel }}</span>
          <SvgIcon v-if="actionIcon" :name="actionIcon" :size="16" class="ml-2" />
        </button>
      </div>
      <slot />
    </div>
  </article>
</template>

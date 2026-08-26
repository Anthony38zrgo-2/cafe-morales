<script setup>
/**
 * SvgIcon — icono SVG reutilizable, solo currentColor
 * Usa registro centralizado en src/icons/registry.js
 */
import { computed } from "vue";
import { getIcon } from "@/icons/registry";

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 24 },
  title: { type: String, default: "" },
  decorative: { type: Boolean, default: true },
});

const icon = computed(() => getIcon(props.name));
const dimension = computed(() => (typeof props.size === "number" ? `${props.size}px` : props.size));
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <svg
    v-if="icon"
    :width="dimension"
    :height="dimension"
    :viewBox="icon.viewBox"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    :aria-hidden="decorative ? 'true' : undefined"
    :aria-label="decorative ? undefined : title || name"
    role="img"
    v-html="icon.path"
  />
  <span v-else class="inline-block" :style="{ width: dimension, height: dimension }" aria-hidden="true">·</span>
</template>

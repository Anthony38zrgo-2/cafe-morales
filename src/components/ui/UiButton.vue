<script setup>
/**
 * UiButton — botón/enlace unificado data-driven
 * variant: primary | secondary | ghost | light
 * Soporta href (renderiza <a>) o button.
 */
import { computed } from "vue";
import SvgIcon from "@/components/ui/SvgIcon.vue";

const props = defineProps({
  label: { type: String, required: true },
  href: { type: String, default: "" },
  variant: { type: String, default: "primary" },
  icon: { type: String, default: "" },
  external: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
});

const isLink = computed(() => Boolean(props.href) && !props.disabled);
const classes = computed(() => {
  const base = "button";
  const variants = {
    primary: "button-primary",
    secondary: "button-secondary",
    ghost: "button-ghost",
    light: "button-light",
  };
  return [base, variants[props.variant] || variants.primary].join(" ");
});
</script>

<template>
  <a
    v-if="isLink"
    :href="href"
    :class="classes"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
  >
    <span>{{ label }}</span>
    <SvgIcon v-if="icon" :name="icon" :size="16" class="ml-2" />
    <SvgIcon v-else-if="external" name="arrow-up-right" :size="14" class="ml-1.5 opacity-70" />
  </a>
  <button v-else :class="classes" :disabled="disabled" type="button">
    <span>{{ label }}</span>
    <SvgIcon v-if="icon" :name="icon" :size="16" class="ml-2" />
  </button>
</template>

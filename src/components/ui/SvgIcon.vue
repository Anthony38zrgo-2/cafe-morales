<script setup>
/**
 * SvgIcon — icono SVG reutilizable, solo currentColor
 * - Si `name` existe en src/icons/registry.js → usa SVG local (óptimo, cero deps)
 * - Si `name` contiene ":" (ej. "mdi:whatsapp", "lucide:coffee") → usa Iconify vía @iconify/vue
 *   También puedes importar directo con unplugin-icons: `import IconWhatsapp from '~icons/mdi/whatsapp'`
 */
import { computed } from "vue";
import { getIcon } from "@/icons/registry";
import { Icon as IconifyIcon } from "@iconify/vue";

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 24 },
  title: { type: String, default: "" },
  decorative: { type: Boolean, default: true },
});

const isIconify = computed(() => props.name.includes(":"));
const icon = computed(() => (isIconify.value ? null : getIcon(props.name)));
const dimension = computed(() => (typeof props.size === "number" ? `${props.size}px` : props.size));
const isFill = computed(() => icon.value?.fill === true);
</script>

<template>
  <!-- Iconify (unplugin-icons / Iconify collections) -->
  <IconifyIcon
    v-if="isIconify"
    :icon="name"
    :width="dimension"
    :height="dimension"
    :aria-hidden="decorative ? 'true' : undefined"
    :aria-label="decorative ? undefined : title || name"
    role="img"
  />
  <!-- Registro local -->
  <!-- eslint-disable-next-line vue/no-v-html -->
  <svg
    v-else-if="icon"
    :width="dimension"
    :height="dimension"
    :viewBox="icon.viewBox"
    :fill="isFill ? 'currentColor' : 'none'"
    :stroke="isFill ? 'none' : 'currentColor'"
    :stroke-width="isFill ? undefined : '1.8'"
    :stroke-linecap="isFill ? undefined : 'round'"
    :stroke-linejoin="isFill ? undefined : 'round'"
    :aria-hidden="decorative ? 'true' : undefined"
    :aria-label="decorative ? undefined : title || name"
    role="img"
    v-html="icon.path"
  />
  <span v-else class="inline-block" :style="{ width: dimension, height: dimension }" aria-hidden="true">·</span>
</template>

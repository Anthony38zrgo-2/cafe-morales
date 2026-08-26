<script setup>
defineProps({
  label: { type: String, required: true },
  variant: { type: String, default: "default" },
});
</script>

<template>
  <span
    class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider"
    :class="variant === 'accent' ? 'bg-accent text-ink' : 'bg-brand/10 text-brand'"
  >
    {{ label }}
  </span>
</template>

<script setup>
/**
 * Container — page-container con maxWidth configurable
 */
defineProps({
  maxWidth: { type: String, default: "7xl" },
});
</script>

<template>
  <div class="page-container" :class="`max-w-${maxWidth}`">
    <slot />
  </div>
</template>

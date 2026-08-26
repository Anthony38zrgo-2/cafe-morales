<script setup>
defineProps({
  categories: { type: Array, required: true },
  active: { type: String, required: true },
});
defineEmits(["select"]);
</script>

<template>
  <div class="category-filters" role="group" aria-label="Filtrar por categoría">
    <button
      v-for="cat in categories"
      :key="cat"
      type="button"
      class="filter-button"
      :class="{ active: active === cat }"
      :aria-pressed="active === cat"
      @click="$emit('select', cat)"
    >
      {{ cat }}
    </button>
  </div>
</template>

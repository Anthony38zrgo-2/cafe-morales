<script setup>
defineProps({
  brand: { type: Object, required: true },
  legal: { type: String, default: "" },
  location: { type: String, default: "" },
});
const year = new Date().getFullYear();
</script>

<template>
  <footer class="site-footer">
    <div class="page-container footer-grid">
      <div>
        <strong>{{ brand.name }}</strong>
        <p>{{ brand.description }}</p>
        <p class="mt-3 text-white/50 text-xs">{{ brand.tagline }}</p>
      </div>
      <div class="text-right">
        <p class="text-white/80">{{ location }}</p>
        <p class="mt-1 text-white/50">© {{ year }} {{ brand.name }}. {{ legal }}</p>
      </div>
    </div>
  </footer>
</template>

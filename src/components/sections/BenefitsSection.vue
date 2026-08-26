<script setup>
import SectionHeader from "@/components/ui/SectionHeader.vue";
import SvgIcon from "@/components/ui/SvgIcon.vue";

defineProps({
  eyebrow: { type: String, default: "" },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  items: { type: Array, default: () => [] },
  variant: { type: String, default: "numbered" },
});
</script>

<template>
  <section id="benefits" class="section-space" aria-labelledby="benefits-title">
    <div class="page-container">
      <SectionHeader :eyebrow="eyebrow" :title="title" :description="description" heading-id="benefits-title" />

      <ol class="benefits-grid" :class="variant">
        <li v-for="(item, index) in items" :key="item.title || index">
          <span v-if="variant === 'icons' && item.icon" class="benefit-icon">
            <SvgIcon :name="item.icon" :size="22" />
          </span>
          <span v-else class="benefit-number">{{ String(index + 1).padStart(2, "0") }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>

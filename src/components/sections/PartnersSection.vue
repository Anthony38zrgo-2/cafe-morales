<script setup>
/**
 * PartnersSection — grid de partners (productores/tostadores) del market
 * Data-driven desde src/data/partners.js. Props: eyebrow/title/description.
 */
import { PARTNERS } from "@/data/partners";
import SectionHeader from "@/components/ui/SectionHeader.vue";

defineProps({
  eyebrow: { type: String, default: "" },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  variant: { type: String, default: "grid" },
});
</script>

<template>
  <section id="partners" class="section-space section-muted" aria-labelledby="partners-title">
    <div class="page-container">
      <SectionHeader :eyebrow="eyebrow" :title="title" :description="description" heading-id="partners-title" />

      <div class="partners-grid">
        <article
          v-for="partner in PARTNERS"
          :key="partner.id"
          class="partner-card"
          :aria-label="partner.brand"
        >
          <img :src="partner.logo" :alt="partner.brand" class="h-20 w-20 object-contain" loading="lazy" decoding="async">
          <div class="partner-card-head">
            <h3>{{ partner.brand }}</h3>
            <p>{{ partner.name }}</p>
          </div>
          <p class="partner-since">Desde {{ partner.founded }}</p>
          <p class="partner-story">{{ partner.story }}</p>
          <ul v-if="partner.origins?.length" class="partner-origins" aria-label="Orígenes">
            <li v-for="origin in partner.origins" :key="origin" class="partner-origin-chip">{{ origin }}</li>
          </ul>
          <a
            v-if="partner.facebook"
            :href="partner.facebook"
            target="_blank"
            rel="noopener noreferrer"
            class="button button-secondary partner-link"
          >
            Facebook
          </a>
        </article>
      </div>
    </div>
  </section>
</template>

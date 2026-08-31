<script setup>
/**
 * PartnersSection — origen del café + criterios de selección del market.
 * Partners desde partners.js; narrativa y visual configurables desde site.config.js.
 */
import { computed } from "vue";
import { PARTNERS } from "@/data/partners";
import { getPartnerImage } from "@/data/partnerImages";
import MediaVisual from "@/components/ui/MediaVisual.vue";
import SectionHeader from "@/components/ui/SectionHeader.vue";

const props = defineProps({
  eyebrow: { type: String, default: "" },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  visual: { type: Object, default: null },
  criteriaTitle: { type: String, default: "Nuestra forma de elegir" },
  criteriaDescription: { type: String, default: "" },
  criteria: { type: Array, default: () => [] },
  variant: { type: String, default: "grid" },
});

const resolvedVisual = computed(() => {
  const visual = props.visual;
  if (visual?.type !== "image" || typeof visual.src !== "string") return visual;
  if (visual.src.startsWith("http") || visual.src.startsWith("/")) return visual;
  const url = getPartnerImage(visual.src);
  return url ? { ...visual, src: url } : visual;
});
</script>

<template>
  <section id="partners" class="section-space section-muted" aria-labelledby="partners-title">
    <div class="page-container">
      <SectionHeader :eyebrow="eyebrow" :title="title" :description="description" heading-id="partners-title" />

      <div class="origin-selection-grid">
        <MediaVisual
          v-if="resolvedVisual"
          :visual="resolvedVisual"
          :label="title"
          class="origin-selection-visual"
        />

        <div class="origin-selection-content">
          <article
            v-for="partner in PARTNERS"
            :key="partner.id"
            class="partner-profile"
            :aria-labelledby="`partner-${partner.id}-title`"
          >
            <div class="partner-profile-head">
              <img :src="partner.logo" :alt="partner.brand" class="partner-logo" loading="lazy" decoding="async">
              <div class="partner-card-head">
                <h3 :id="`partner-${partner.id}-title`">{{ partner.brand }}</h3>
                <p>{{ partner.name }}</p>
                <p class="partner-since">Desde {{ partner.founded }}</p>
              </div>
            </div>
            <p class="partner-story">{{ partner.story }}</p>
            <ul v-if="partner.origins?.length" class="partner-origins" aria-label="Regiones de origen">
              <li v-for="origin in partner.origins" :key="origin" class="partner-origin-chip">{{ origin }}</li>
            </ul>
            <a
              v-if="partner.facebook"
              :href="partner.facebook"
              target="_blank"
              rel="noopener noreferrer"
              class="button button-secondary partner-link"
            >
              Conocer al productor
            </a>
          </article>

          <div v-if="criteria?.length" class="selection-criteria" aria-labelledby="selection-criteria-title">
            <p class="eyebrow">Cómo seleccionamos</p>
            <h3 id="selection-criteria-title">{{ criteriaTitle }}</h3>
            <p v-if="criteriaDescription" class="selection-criteria-description">{{ criteriaDescription }}</p>
            <ol class="selection-criteria-list">
              <li v-for="(criterion, index) in criteria" :key="criterion.title">
                <span aria-hidden="true">{{ String(index + 1).padStart(2, "0") }}</span>
                <div>
                  <h4>{{ criterion.title }}</h4>
                  <p>{{ criterion.description }}</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

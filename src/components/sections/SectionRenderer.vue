<script setup>
/**
 * SectionRenderer — renderiza cualquier sección data-driven
 * Mapea id → componente y pasa props del config.
 */
import HeroSection from "@/components/sections/HeroSection.vue";
import CatalogSection from "@/components/sections/CatalogSection.vue";
import PartnersSection from "@/components/sections/PartnersSection.vue";
import LoyaltySection from "@/components/sections/LoyaltySection.vue";
import AboutSection from "@/components/sections/AboutSection.vue";
import BenefitsSection from "@/components/sections/BenefitsSection.vue";
import ContactSection from "@/components/sections/ContactSection.vue";

const props = defineProps({
  section: { type: Object, required: true },
});

const registry = {
  hero: HeroSection,
  catalog: CatalogSection,
  partners: PartnersSection,
  loyalty: LoyaltySection,
  about: AboutSection,
  benefits: BenefitsSection,
  contact: ContactSection,
};

const component = registry[props.section.id] || null;
</script>

<template>
  <div :data-dev-section="section.id">
    <component :is="component" v-if="component" v-bind="section.props" :variant="section.variant" />
  </div>
</template>

<script setup>
/**
 * LoyaltySection — Programa Amigos del Café (recurrentes, premios y esencia del día)
 * Props: eyebrow/title/description/items[]/note/ctaLabel/ctaMessage, variant numbering.
 */
import { siteConfig } from "@/config/site.config";
import { createWhatsAppUrl } from "@/composables/useWhatsApp";
import SectionHeader from "@/components/ui/SectionHeader.vue";
import SvgIcon from "@/components/ui/SvgIcon.vue";
import UiButton from "@/components/ui/UiButton.vue";

const props = defineProps({
  eyebrow: { type: String, default: "" },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  items: { type: Array, default: () => [] },
  note: { type: String, default: "" },
  ctaLabel: { type: String, default: "" },
  ctaMessage: { type: String, default: "" },
  variant: { type: String, default: "grid" },
});

function whatsappUrl() {
  const msg = props.ctaMessage || "Hola, soy cliente recurrente de Morales Coffee Market.";
  return createWhatsAppUrl(msg, siteConfig);
}
</script>

<template>
  <section id="loyalty" class="section-space" aria-labelledby="loyalty-title">
    <div class="page-container">
      <SectionHeader :eyebrow="eyebrow" :title="title" :description="description" heading-id="loyalty-title" />

      <ol class="benefits-grid" :class="variant">
        <li v-for="(item, index) in items" :key="item.title || index">
          <span class="benefit-icon">
            <SvgIcon :name="item.icon || 'gift'" :size="22" />
          </span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </li>
      </ol>

      <p v-if="note" class="section-intro loyalty-note">{{ note }}</p>
      <div v-if="ctaLabel" class="loyalty-cta">
        <UiButton :label="ctaLabel" :href="whatsappUrl()" variant="primary" external />
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { siteConfig } from "@/config/site.config";
import { createWhatsAppUrl, buildDefaultMessage } from "@/composables/useWhatsApp";
import UiButton from "@/components/ui/UiButton.vue";
import { vReveal } from "@/composables/useScrollReveal";

defineProps({
  eyebrow: { type: String, default: "Contacto" },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  note: { type: String, default: "" },
  actionLabel: { type: String, default: "Escribir ahora" },
  variant: { type: String, default: "centered" },
});

const whatsappUrl = computed(() => createWhatsAppUrl(buildDefaultMessage(siteConfig), siteConfig));
</script>

<template>
  <section id="contact" class="contact-section section-space" aria-labelledby="contact-title">
    <div class="page-container">
      <div v-reveal class="contact-inner" :class="variant === 'split' ? 'text-left' : 'text-center'">
        <p class="eyebrow">{{ eyebrow }}</p>
        <h2 id="contact-title" class="section-title" :class="variant !== 'split' ? 'mx-auto' : ''">{{ title }}</h2>
        <p v-if="description">{{ description }}</p>
        <div class="mt-8 flex justify-center">
          <UiButton :label="actionLabel" :href="whatsappUrl" variant="light" :external="true" icon="whatsapp" />
        </div>
        <small v-if="note">{{ note }}</small>
      </div>
    </div>
  </section>
</template>

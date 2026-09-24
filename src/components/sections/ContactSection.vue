<script setup>
import { computed } from "vue";
import { siteConfig } from "@/config/site.config";
import { createWhatsAppUrl, buildDefaultMessage } from "@/composables/useWhatsApp";
import UiButton from "@/components/ui/UiButton.vue";
import { vReveal } from "@/composables/useScrollReveal";
import { getCoffeeImage } from "@/data/coffeeImages";

const props = defineProps({
  eyebrow: { type: String, default: "Contacto" },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  note: { type: String, default: "" },
  actionLabel: { type: String, default: "Escribir ahora" },
  variant: { type: String, default: "centered" },
  visual: { type: Object, default: null },
  decoration: { type: Object, default: null },
});

const whatsappUrl = computed(() => createWhatsAppUrl(buildDefaultMessage(siteConfig), siteConfig));
const contactVisualSrc = computed(() =>
  props.visual?.type === "image" ? getCoffeeImage(props.visual?.src) : "",
);
const contactDecorationSrc = computed(() =>
  props.decoration?.src ? getCoffeeImage(props.decoration.src) : "",
);
</script>

<template>
  <section id="contact" class="contact-section section-space" aria-labelledby="contact-title">
    <div class="page-container">
      <div
        v-reveal
        class="contact-inner"
        :class="[
          variant === 'split' ? 'text-left' : 'text-center',
          { 'contact-inner-with-visual': contactVisualSrc },
          { 'contact-inner-with-decoration': contactDecorationSrc },
        ]"
      >
        <img
          v-if="contactVisualSrc"
          class="contact-visual"
          :src="contactVisualSrc"
          :alt="visual.alt || ''"
          loading="lazy"
          decoding="async"
        >
        <img
          v-if="contactDecorationSrc"
          class="contact-floating-beans"
          :src="contactDecorationSrc"
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
        >
        <div class="contact-copy">
          <p class="eyebrow">{{ eyebrow }}</p>
          <h2 id="contact-title" class="section-title" :class="variant !== 'split' ? 'mx-auto' : ''">{{ title }}</h2>
          <p v-if="description">{{ description }}</p>
          <div class="mt-8 flex justify-center">
            <UiButton :label="actionLabel" :href="whatsappUrl" variant="light" :external="true" icon="whatsapp" />
          </div>
          <small v-if="note">{{ note }}</small>
        </div>
      </div>
    </div>
  </section>
</template>

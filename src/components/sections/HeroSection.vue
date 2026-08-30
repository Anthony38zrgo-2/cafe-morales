<script setup>
/**
 * HERO — variantes: split | centered | highlight
 * Todo data-driven vía props, sin import siteConfig directo salvo guards.
 */
import { computed } from "vue";
import { siteConfig } from "@/config/site.config";
import { isConfiguredLinkAvailable } from "@/config/sections";
import { getCoffeeImage } from "@/data/coffeeImages";
import MediaVisual from "@/components/ui/MediaVisual.vue";
import UiButton from "@/components/ui/UiButton.vue";
import Hero3D from "@/components/sections/Hero3D.vue";

const props = defineProps({
  eyebrow: { type: String, default: "" },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  actions: { type: Array, default: () => [] },
  visual: { type: Object, default: null },
  highlights: { type: Array, default: () => [] },
  variant: { type: String, default: "split" },
  decoration: { type: Object, default: null },
});

const visibleActions = computed(() =>
  (props.actions || []).filter((a) => isConfiguredLinkAvailable(a.href, siteConfig)),
);
const isModel = computed(() => props.visual?.type === "model");
const decorationSrc = computed(() => {
  const key = props.decoration?.src;
  return key ? getCoffeeImage(key) : "";
});
const hasDecoration = computed(() => Boolean(decorationSrc.value));
const decorationPlacement = computed(() => props.decoration?.placement || "floating");
const decorationMotion = computed(() => props.decoration?.motion !== false);
</script>

<template>
  <section
    id="top"
    class="hero-section section-space"
    :class="variant"
    aria-labelledby="hero-title"
  >
    <div class="page-container" :class="variant === 'centered' ? '' : 'split-grid'">
      <div :class="variant === 'centered' ? 'max-w-3xl text-center' : ''">
        <p v-if="eyebrow" class="eyebrow" :class="variant === 'centered' ? 'mx-auto' : ''">{{ eyebrow }}</p>
        <h1 id="hero-title" class="display-title" :class="variant === 'centered' ? 'mx-auto text-center' : ''">
          {{ title }}
        </h1>
        <p v-if="description" class="lead" :class="variant === 'centered' ? 'mx-auto text-center' : ''">
          {{ description }}
        </p>

        <div v-if="highlights?.length" class="mt-6 flex flex-wrap gap-2" :class="variant === 'centered' ? 'justify-center' : ''">
          <span
            v-for="h in highlights"
            :key="h"
            class="rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand"
          >
            {{ h }}
          </span>
        </div>

        <div v-if="visibleActions.length" class="button-row" :class="variant === 'centered' ? 'justify-center' : ''">
          <UiButton
            v-for="action in visibleActions"
            :key="action.label"
            :label="action.label"
            :href="action.href"
            :variant="action.variant || 'primary'"
          />
        </div>
      </div>

      <div v-if="visual" class="hero-visual-wrap">
        <Hero3D
          v-if="isModel"
          :visual="visual"
          :label="title"
          class="hero-visual w-full"
        />

        <MediaVisual
          v-else
          :visual="visual"
          :label="title"
          class="hero-visual w-full"
        />

        <img
          v-if="hasDecoration"
          :src="decorationSrc"
          alt=""
          aria-hidden="true"
          width="520"
          height="520"
          loading="eager"
          decoding="async"
          class="hero-beans"
          :class="[decorationPlacement, { motion: decorationMotion }]"
        />
      </div>
    </div>
  </section>
</template>

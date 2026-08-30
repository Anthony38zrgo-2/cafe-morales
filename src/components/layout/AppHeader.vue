<script setup>
/**
 * HEADER: identidad y navegación data-driven
 * Recibe brand y navigation filtrados desde siteConfig.
 */
import { computed } from "vue";
import { siteConfig } from "@/config/site.config";
import { getFirstContentHref } from "@/config/sections";
import { getCoffeeImage } from "@/data/coffeeImages";
import SvgIcon from "@/components/ui/SvgIcon.vue";

defineProps({
  brand: { type: Object, required: true },
  navigation: { type: Array, default: () => [] },
});

const homeHref = computed(() => getFirstContentHref(siteConfig));
const brandLogoSrc = computed(() => getCoffeeImage("bean-single"));
</script>

<template>
  <header class="site-header">
    <div class="page-container header-inner">
      <a class="brand" :href="homeHref" :aria-label="`Ir al inicio de ${brand.name}`">
        <img
          v-if="brandLogoSrc"
          :src="brandLogoSrc"
          alt=""
          aria-hidden="true"
          width="36"
          height="36"
          class="brand-logo"
          loading="eager"
          decoding="async"
        />
        <span v-else class="brand-mark" aria-hidden="true">{{ brand.shortName }}</span>
        <span>{{ brand.name }}</span>
      </a>
      <nav aria-label="Navegación principal">
        <a v-for="item in navigation" :key="item.href" :href="item.href">
          {{ item.label }}
        </a>
      </nav>
      <a
        v-if="siteConfig.site.contact.phone"
        class="hidden md:inline-flex button button-primary !min-h-10 !px-5 text-sm"
        :href="`https://wa.me/${siteConfig.site.contact.phone.replace(/\D/g, '')}?text=${encodeURIComponent(siteConfig.site.contact.whatsappDefaultMessage || 'Hola')}`"
        target="_blank"
        rel="noopener noreferrer"
      >
        <SvgIcon name="whatsapp" :size="16" class="mr-2" />
        Cotizar
      </a>
    </div>
  </header>
</template>

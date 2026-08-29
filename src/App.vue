<script setup>
import { computed, onMounted, defineAsyncComponent } from "vue";
import { siteConfig } from "@/config/site.config";
import { validateConfig } from "@/config/validate";
import { getOrderedSections, getNavigationItems, isSectionEnabled } from "@/config/sections";
import { useTheme } from "@/composables/useTheme";
import { useDevConfig } from "@/composables/useDevConfig";
import { useCatalogStore } from "@/composables/useCatalogStore";
import AppHeader from "@/components/layout/AppHeader.vue";
import AppFooter from "@/components/layout/AppFooter.vue";
import SectionRenderer from "@/components/sections/SectionRenderer.vue";
import FloatingContact from "@/components/ui/FloatingContact.vue";

const isDev = import.meta.env.DEV;
const DevSidebar = isDev ? defineAsyncComponent(() => import("@/components/dev/DevSidebar.vue")) : null;

// Validación solo en dev (evita ruido en prod)
if (isDev) {
  const errors = validateConfig(siteConfig);
  if (errors.length) {
    console.warn("Configuración inválida:\n - " + errors.join("\n - "));
  }
  // Hidrata siteConfig y catálogo desde localStorage (reactive en DEV)
  const devConfig = useDevConfig();
  useCatalogStore();
  // Backstop: si tras hidratar el config quedó inválido (p.ej. archivo live corrupto),
  // restaurar desde base para no pintar la página en blanco.
  if (!devConfig.isValid()) {
    console.warn("[dev] siteConfig inválido tras hidratar; restaurando config base.");
    devConfig.reset();
  }
}

// Tema (siteConfig es reactive en DEV, watchEffect re-aplica)
useTheme(siteConfig);

const orderedContent = computed(() =>
  getOrderedSections(siteConfig).filter((s) => !["header", "footer", "floating-contact"].includes(s.id)),
);

const navigation = computed(() => getNavigationItems(siteConfig));

const footerSection = computed(() => siteConfig.sections.find((s) => s.id === "footer"));
const floatingSection = computed(() => siteConfig.sections.find((s) => s.id === "floating-contact"));

const showHeader = computed(() => isSectionEnabled("header", siteConfig));
const showFooter = computed(() => isSectionEnabled("footer", siteConfig));
const showFloating = computed(() => isSectionEnabled("floating-contact", siteConfig));

onMounted(() => {
  // Smooth scroll offset por header sticky
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.pushState(null, "", href);
      }
    });
  });
});
</script>

<template>
  <div class="page-shell">
    <AppHeader v-if="showHeader" :brand="siteConfig.site.brand" :navigation="navigation" />

    <main>
      <SectionRenderer v-for="section in orderedContent" :key="section.id" :section="section" />
    </main>

    <AppFooter
      v-if="showFooter"
      :brand="siteConfig.site.brand"
      :legal="footerSection?.props?.legal || ''"
      :location="footerSection?.props?.location || ''"
    />

    <FloatingContact
      v-if="showFloating"
      :panel-title="floatingSection?.props?.panelTitle"
      :panel-description="floatingSection?.props?.panelDescription"
      :questions="floatingSection?.props?.questions || []"
      :variant="floatingSection?.variant || 'panel'"
    />
  </div>
  <component :is="DevSidebar" v-if="isDev" />
</template>

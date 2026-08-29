<script setup>
/**
 * CATÁLOGO — grid | list | carousel | masonry, con filtros, gift banner y pedido opcional
 * En DEV usa catalog reactivo de useCatalogStore (localStorage)
 * Filtro por categoría (gama) y por partner; Card recibe presentations ya mapeadas a srcs.
 */
import { computed, ref } from "vue";
import baseCatalog from "@/data/catalog.json";
import { PRODUCT_IMAGES } from "@/data/productImages";
import { getPartner } from "@/data/partners";
import { siteConfig } from "@/config/site.config";
import { useCatalog } from "@/composables/useCatalog";
import { useCatalogStore } from "@/composables/useCatalogStore";
import SectionHeader from "@/components/ui/SectionHeader.vue";
import FilterGroup from "@/components/ui/FilterGroup.vue";
import Card from "@/components/ui/Card.vue";
import SvgIcon from "@/components/ui/SvgIcon.vue";
import OrderModal from "@/components/ui/OrderModal.vue";

const props = defineProps({
  eyebrow: { type: String, default: "Catálogo" },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  emptyMessage: { type: String, default: "Sin productos." },
  columns: { type: Object, default: () => ({ base: 1, md: 2, lg: 3 }) },
  cardVariant: { type: String, default: "elevated" },
  showFilters: { type: Boolean, default: true },
  variant: { type: String, default: "grid" },
});

const catalogSource = import.meta.env.DEV ? useCatalogStore().state : baseCatalog;
const { activeCategory, categories, filtered, setCategory } = useCatalog(catalogSource);
const selectedProduct = ref(null);
const selectedPresentation = ref(null);
const orderEnabled = computed(() => siteConfig.order?.enabled === true);
const track = ref(null);

const activePartner = ref("Todos");
const filtersOpen = ref(false);
const hasFilters = computed(() => props.showFilters && catalogSource.length > 0);
const anyFilterActive = computed(() => activeCategory.value !== "Todos" || activePartner.value !== "Todos");
const partnerFilters = computed(() => {
  const ids = [...new Set(catalogSource.map((i) => i.partnerId).filter(Boolean))];
  return ["Todos", ...ids.map((id) => getPartner(id)?.brand || id)];
});
const partnerValues = computed(() => {
  const ids = [...new Set(catalogSource.map((i) => i.partnerId).filter(Boolean))];
  const map = { Todos: "Todos" };
  ids.forEach((id) => (map[getPartner(id)?.brand || id] = id));
  return map;
});
const partnerFiltered = computed(() => {
  const value = partnerValues.value[activePartner.value];
  if (!value || value === "Todos") return filtered.value;
  return filtered.value.filter((i) => i.partnerId === value);
});

function scrollCarousel(dir) {
  track.value?.scrollBy({ left: dir * 340, behavior: "smooth" });
}

function openOrder(payload) {
  if (!orderEnabled.value) return;
  selectedProduct.value = payload?.product || null;
  selectedPresentation.value = payload?.unit ? { unit: payload.unit, price: payload.price } : null;
}
function closeOrder() {
  selectedProduct.value = null;
  selectedPresentation.value = null;
}

function getImageSrc(id) {
  return PRODUCT_IMAGES[id] || "";
}
function mapPresentations(item) {
  return (item.presentations || []).map((p) => ({ ...p, imageSrc: getImageSrc(p.image) }));
}
function partnerName(id) {
  return getPartner(id)?.brand || "";
}
function partnerLogo(id) {
  return getPartner(id)?.logo || "";
}
</script>

<template>
  <section id="catalog" class="section-space" aria-labelledby="catalog-title">
    <div class="page-container">
      <SectionHeader :eyebrow="eyebrow" :title="title" :description="description" heading-id="catalog-title" />

      <!-- Toggle de filtros (ocultos por defecto) -->
      <div v-if="hasFilters" class="filters-bar">
        <button
          type="button"
          class="filters-toggle"
          :class="{ open: filtersOpen, active: anyFilterActive }"
          :aria-expanded="filtersOpen"
          aria-controls="catalog-filters"
          @click="filtersOpen = !filtersOpen"
        >
          <SvgIcon name="filter" :size="16" />
          <span>Filtros</span>
          <span v-if="anyFilterActive" class="filters-dot" aria-hidden="true" />
        </button>
      </div>

      <!-- Filtros desplegables -->
      <div v-if="hasFilters && filtersOpen" id="catalog-filters" class="filters-panel">
        <FilterGroup
          v-if="catalogSource.length"
          :categories="categories"
          :active="activeCategory"
          @select="setCategory"
        />

        <FilterGroup
          v-if="partnerFilters.length > 1"
          :categories="partnerFilters"
          :active="activePartner"
          aria-label="Filtrar por partner"
          @select="activePartner = $event"
        />
      </div>

      <!-- GRID / LIST -->
      <div v-if="partnerFiltered.length && (variant === 'grid' || variant === 'list')" class="catalog-grid" :class="variant">
        <Card
          v-for="item in partnerFiltered"
          :key="item.id"
          :title="item.name"
          :description="item.description"
          :category="item.category"
          :badge="item.badge"
          :price="item.price"
          :visual="item.visual"
          :image-src="getImageSrc(item.id)"
          :aspect="item.visual?.aspect || '4 / 3'"
          :action-label="orderEnabled ? 'Pedir por WhatsApp' : ''"
          action-icon="whatsapp"
          :presentations="mapPresentations(item)"
          :partner-name="partnerName(item.partnerId)"
          :partner-logo="partnerLogo(item.partnerId)"
          :flags="item.flags"
          :product="item"
          @action="openOrder"
        />
      </div>

      <!-- CAROUSEL -->
      <div v-else-if="partnerFiltered.length && variant === 'carousel'" class="carousel-wrap" role="region" aria-roledescription="carousel" aria-label="Catálogo carrusel">
        <div ref="track" class="catalog-grid carousel">
          <Card
            v-for="item in partnerFiltered"
            :key="item.id"
            :title="item.name"
            :description="item.description"
            :category="item.category"
            :badge="item.badge"
            :price="item.price"
            :visual="item.visual"
            :image-src="getImageSrc(item.id)"
            :aspect="item.visual?.aspect || '4 / 3'"
            :action-label="orderEnabled ? 'Pedir por WhatsApp' : ''"
            action-icon="whatsapp"
            :presentations="mapPresentations(item)"
            :partner-name="partnerName(item.partnerId)"
            :partner-logo="partnerLogo(item.partnerId)"
            :flags="item.flags"
            :product="item"
            @action="openOrder"
          />
        </div>
        <button type="button" class="carousel-nav prev" aria-label="Anterior" @click="scrollCarousel(-1)">‹</button>
        <button type="button" class="carousel-nav next" aria-label="Siguiente" @click="scrollCarousel(1)">›</button>
      </div>

      <!-- MASONRY -->
      <div v-else-if="partnerFiltered.length && variant === 'masonry'" class="catalog-grid masonry">
        <Card
          v-for="item in partnerFiltered"
          :key="item.id"
          :title="item.name"
          :description="item.description"
          :category="item.category"
          :badge="item.badge"
          :price="item.price"
          :visual="item.visual"
          :image-src="getImageSrc(item.id)"
          :aspect="item.visual?.aspect || '4 / 3'"
          :action-label="orderEnabled ? 'Pedir por WhatsApp' : ''"
          action-icon="whatsapp"
          :presentations="mapPresentations(item)"
          :partner-name="partnerName(item.partnerId)"
          :partner-logo="partnerLogo(item.partnerId)"
          :flags="item.flags"
          :product="item"
          @action="openOrder"
        />
      </div>

      <p v-else-if="!catalogSource.length" class="empty-state">{{ emptyMessage }}</p>
      <p v-else class="empty-state">
        Sin resultados{{ anyFilterActive ? " con los filtros aplicados" : "" }}.
        <button v-if="anyFilterActive" type="button" class="filters-reset" @click="setCategory('Todos'); activePartner = 'Todos'">
          Limpiar filtros
        </button>
      </p>

      <OrderModal
        v-if="selectedProduct"
        :product="selectedProduct"
        :presentation="selectedPresentation"
        @close="closeOrder"
      />
    </div>
  </section>
</template>

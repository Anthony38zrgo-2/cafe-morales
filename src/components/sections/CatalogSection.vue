<script setup>
/**
 * CATÁLOGO — grid | list, con filtros y pedido opcional
 * En DEV usa catalog reactivo de useCatalogStore (localStorage)
 */
import { ref, computed } from "vue";
import baseCatalog from "@/data/catalog.json";
import { PRODUCT_IMAGES } from "@/data/productImages";
import { siteConfig } from "@/config/site.config";
import { useCatalog } from "@/composables/useCatalog";
import { useCatalogStore } from "@/composables/useCatalogStore";
import SectionHeader from "@/components/ui/SectionHeader.vue";
import FilterGroup from "@/components/ui/FilterGroup.vue";
import Card from "@/components/ui/Card.vue";
import OrderModal from "@/components/ui/OrderModal.vue";

defineProps({
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
const orderEnabled = computed(() => siteConfig.order?.enabled === true);
const track = ref(null);
function scrollCarousel(dir) {
  track.value?.scrollBy({ left: dir * 340, behavior: "smooth" });
}

function openOrder(product) {
  if (!orderEnabled.value) return;
  selectedProduct.value = product;
}
function closeOrder() {
  selectedProduct.value = null;
}

function getImageSrc(id) {
  return PRODUCT_IMAGES[id] || "";
}
</script>

<template>
  <section id="catalog" class="section-space" aria-labelledby="catalog-title">
    <div class="page-container">
      <SectionHeader :eyebrow="eyebrow" :title="title" :description="description" heading-id="catalog-title" />

      <FilterGroup
        v-if="showFilters && catalogSource.length"
        :categories="categories"
        :active="activeCategory"
        @select="setCategory"
      />

      <!-- GRID / LIST -->
      <div v-if="filtered.length && (variant === 'grid' || variant === 'list')" class="catalog-grid" :class="variant">
        <Card
          v-for="item in filtered"
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
          @action="openOrder(item)"
        />
      </div>

      <!-- CAROUSEL -->
      <div v-else-if="filtered.length && variant === 'carousel'" class="carousel-wrap" role="region" aria-roledescription="carousel" aria-label="Catálogo carrusel">
        <div ref="track" class="catalog-grid carousel">
          <Card
            v-for="item in filtered"
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
            @action="openOrder(item)"
          />
        </div>
        <button type="button" class="carousel-nav prev" aria-label="Anterior" @click="scrollCarousel(-1)">‹</button>
        <button type="button" class="carousel-nav next" aria-label="Siguiente" @click="scrollCarousel(1)">›</button>
      </div>

      <!-- MASONRY -->
      <div v-else-if="filtered.length && variant === 'masonry'" class="catalog-grid masonry">
        <Card
          v-for="item in filtered"
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
          @action="openOrder(item)"
        />
      </div>

      <p v-else-if="!catalogSource.length" class="empty-state">{{ emptyMessage }}</p>
      <p v-else class="empty-state">Sin resultados en "{{ activeCategory }}".</p>

      <OrderModal v-if="selectedProduct" :product="selectedProduct" @close="closeOrder" />
    </div>
  </section>
</template>

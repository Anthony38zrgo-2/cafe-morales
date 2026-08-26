<script setup>
/**
 * CATÁLOGO — grid | list, con filtros y pedido opcional
 */
import { ref } from "vue";
import catalog from "@/data/catalog.json";
import { PRODUCT_IMAGES } from "@/data/productImages";
import { siteConfig } from "@/config/site.config";
import { useCatalog } from "@/composables/useCatalog";
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

const { activeCategory, categories, filtered, setCategory } = useCatalog(catalog);
const selectedProduct = ref(null);
const orderEnabled = siteConfig.order?.enabled === true;

function openOrder(product) {
  if (!orderEnabled) return;
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
        v-if="showFilters && catalog.length"
        :categories="categories"
        :active="activeCategory"
        @select="setCategory"
      />

      <div v-if="filtered.length" class="catalog-grid" :class="variant === 'list' ? 'list' : ''">
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

      <p v-else-if="!catalog.length" class="empty-state">{{ emptyMessage }}</p>
      <p v-else class="empty-state">Sin resultados en "{{ activeCategory }}".</p>

      <OrderModal v-if="selectedProduct" :product="selectedProduct" @close="closeOrder" />
    </div>
  </section>
</template>

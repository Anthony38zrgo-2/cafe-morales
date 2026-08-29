<script setup>
/**
 * OrderModal — pedido por WhatsApp, opcional.
 * Solo se muestra si siteConfig.order.enabled === true.
 * Presentaciones: botones pill derivados de product.presentations (fallback "unidades").
 * Regalo: si subtotal >= gift.threshold permite elegir un item de siteConfig.gift.items;
 * si no, muestra progreso "Te faltan S/ X para tu regalo".
 */
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { DELIVERY_LOCATIONS } from "@/data/deliveryLocations";
import { siteConfig } from "@/config/site.config";
import { buildOrderMessage, createWhatsAppUrl } from "@/composables/useWhatsApp";

const props = defineProps({
  product: { type: Object, required: true },
  presentation: { type: Object, default: null },
});
const emit = defineEmits(["close"]);
const modal = ref(null);
const closeButton = ref(null);

const presentations = computed(() => {
  if (props.product?.presentations?.length) return props.product.presentations;
  return [{ unit: "unidades", price: 0 }];
});

const initialIndex = computed(() => {
  if (!props.presentation?.unit) return 0;
  const idx = presentations.value.findIndex((p) => p.unit === props.presentation.unit);
  return idx >= 0 ? idx : 0;
});

const order = reactive({
  product: props.product,
  quantity: 1,
  presentationIndex: initialIndex.value,
  province: "",
  district: "",
  address: "",
  giftItemId: "",
});

const currentPresentation = computed(() => presentations.value[order.presentationIndex] ?? presentations.value[0]);
const subtotal = computed(() => Math.round(Number(order.quantity) * Number(currentPresentation.value.price) * 100) / 100);

const giftConfig = computed(() => {
  const g = siteConfig.gift;
  if (!g?.enabled) return null;
  if (typeof g.threshold !== "number" || !(g.threshold > 0)) return null;
  return g;
});
const giftUnlocked = computed(() => Boolean(giftConfig.value) && subtotal.value >= giftConfig.value.threshold);
const remainingToGift = computed(() =>
  giftConfig.value ? Math.max(0, Math.round((giftConfig.value.threshold - subtotal.value) * 100) / 100) : 0,
);
const giftProgress = computed(() => {
  if (!giftConfig.value) return 0;
  return Math.min(100, (subtotal.value / giftConfig.value.threshold) * 100);
});
const giftLabel = computed(() => {
  if (!giftUnlocked.value) return "";
  const item = (giftConfig.value.items || []).find((i) => i.id === order.giftItemId);
  return item?.label || "";
});

function formatPrice(n) {
  return (Number(n) || 0).toFixed(2);
}

const districts = computed(
  () => DELIVERY_LOCATIONS.find(({ province }) => province === order.province)?.districts ?? [],
);
const isValid = computed(
  () => Number(order.quantity) > 0 && order.province && order.district && order.address.trim().length >= 5,
);

function setProvince(value) {
  order.province = value;
  order.district = "";
}
function closeModal() {
  emit("close");
}
function submitOrder() {
  if (!isValid.value) return;
  const message = buildOrderMessage(
    {
      product: order.product,
      quantity: order.quantity,
      presentation: currentPresentation.value,
      subtotal: subtotal.value,
      giftLabel: giftLabel.value,
      province: order.province,
      district: order.district,
      address: order.address,
    },
    siteConfig,
  );
  window.open(createWhatsAppUrl(message, siteConfig), "_blank", "noopener,noreferrer");
  closeModal();
}
function handleKeydown(event) {
  if (event.key === "Escape") closeModal();
  if (event.key !== "Tab" || !modal.value) return;
  const focusable = [...modal.value.querySelectorAll("button, input, select, textarea")].filter((el) => !el.disabled);
  const first = focusable[0];
  const last = focusable.at(-1);
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
}

onMounted(async () => {
  document.body.style.overflow = "hidden";
  document.addEventListener("keydown", handleKeydown);
  await nextTick();
  closeButton.value?.focus();
});
onBeforeUnmount(() => {
  document.body.style.overflow = "";
  document.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <Teleport to="body">
    <div class="modal-backdrop" @mousedown.self="closeModal">
      <section ref="modal" class="order-modal" role="dialog" aria-modal="true" aria-labelledby="order-title">
        <header>
          <div>
            <p class="eyebrow">Pedido por WhatsApp</p>
            <h2 id="order-title">{{ product.name }}</h2>
            <p>{{ product.description }}</p>
          </div>
          <button ref="closeButton" type="button" class="modal-close" aria-label="Cerrar pedido" @click="closeModal">×</button>
        </header>

        <form @submit.prevent="submitOrder">
          <div class="presentation-select" role="group" aria-label="Presentación">
            <button
              v-for="(p, i) in presentations"
              :key="p.unit"
              type="button"
              class="presentation-pill"
              :class="{ active: order.presentationIndex === i }"
              :aria-pressed="order.presentationIndex === i"
              @click="order.presentationIndex = i"
            >
              {{ p.unit }} · S/ {{ formatPrice(p.price) }}
            </button>
          </div>

          <div class="form-grid quantity-grid">
            <label>
              Cantidad
              <input v-model.number="order.quantity" type="number" inputmode="numeric" min="1" max="9999" required>
            </label>
            <label class="justify-end flex flex-col">
              Subtotal
              <strong class="text-lg font-bold">S/ {{ formatPrice(subtotal) }}</strong>
            </label>
          </div>

          <div v-if="giftConfig" class="gift-box" :class="{ unlocked: giftUnlocked }">
            <template v-if="giftUnlocked">
              <label class="gift-label">
                Regalo por +S/{{ giftConfig.threshold }}: elige el tuyo
                <select v-model="order.giftItemId">
                  <option v-for="item in giftConfig.items" :key="item.id" :value="item.id">{{ item.label }}</option>
                </select>
              </label>
            </template>
            <template v-else>
              <p class="gift-progress-text">
                Te faltan S/ {{ formatPrice(remainingToGift) }} para tu regalo
                <span v-if="giftConfig.items.length" class="text-muted">({{ giftConfig.items[0].label }})</span>
              </p>
              <div class="gift-progress" aria-hidden="true">
                <div class="gift-progress-fill" :style="{ width: giftProgress + '%' }"></div>
              </div>
            </template>
          </div>

          <div class="form-grid">
            <label>
              Provincia
              <select :value="order.province" required @change="setProvince($event.target.value)">
                <option value="">Seleccionar provincia</option>
                <option v-for="loc in DELIVERY_LOCATIONS" :key="loc.province" :value="loc.province">
                  {{ loc.province }}
                </option>
              </select>
            </label>
            <label>
              Distrito
              <select v-model="order.district" :disabled="!order.province" required>
                <option value="">Seleccionar distrito</option>
                <option v-for="d in districts" :key="d" :value="d">{{ d }}</option>
              </select>
            </label>
          </div>

          <label class="mt-4 flex flex-col gap-1.5 text-sm font-semibold">
            Dirección de entrega
            <input
              v-model.trim="order.address"
              type="text"
              maxlength="180"
              placeholder="Calle, número y referencia"
              required
            >
          </label>

          <button type="submit" class="button button-primary order-submit" :disabled="!isValid">
            Enviar pedido por WhatsApp <span aria-hidden="true">↗</span>
          </button>
          <p class="form-help">Confirmaremos disponibilidad, precio y costo de delivery por WhatsApp.</p>
        </form>
      </section>
    </div>
  </Teleport>
</template>

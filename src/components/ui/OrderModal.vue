<script setup>
/**
 * OrderModal — pedido por WhatsApp, opcional.
 * Solo se muestra si siteConfig.order.enabled === true.
 * Campos: cantidad, unidad, provincia, distrito, dirección.
 */
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { DELIVERY_LOCATIONS } from "@/data/deliveryLocations";
import { siteConfig } from "@/config/site.config";
import { buildOrderMessage, createWhatsAppUrl } from "@/composables/useWhatsApp";

const props = defineProps({ product: { type: Object, required: true } });
const emit = defineEmits(["close"]);
const modal = ref(null);
const closeButton = ref(null);

const order = reactive({
  product: props.product,
  quantity: 1,
  unit: siteConfig.order?.units?.[0] || "unidades",
  province: "",
  district: "",
  address: "",
});

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
  window.open(createWhatsAppUrl(buildOrderMessage(order), siteConfig), "_blank", "noopener,noreferrer");
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
          <div class="form-grid quantity-grid">
            <label>
              Cantidad
              <input v-model.number="order.quantity" type="number" inputmode="numeric" min="1" max="9999" required>
            </label>
            <label>
              Unidad
              <select v-model="order.unit">
                <option v-for="u in siteConfig.order?.units || ['unidades']" :key="u" :value="u">{{ u }}</option>
              </select>
            </label>
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

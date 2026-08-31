<script setup>
/**
 * FloatingContact — botón flotante + panel opcional con preguntas frecuentes
 * variant: "panel" (con 4 preguntas + mensaje) | "simple" (solo botón)
 */
import { ref, onMounted, onBeforeUnmount } from "vue";
import { siteConfig } from "@/config/site.config";
import { createWhatsAppUrl } from "@/composables/useWhatsApp";
import SvgIcon from "@/components/ui/SvgIcon.vue";
import coffeeFoam from "@/assets/coffee/coffee-foam.webp";

defineProps({
  panelTitle: { type: String, default: "Conversemos" },
  panelDescription: { type: String, default: "Elige una opción o escribe tu consulta." },
  questions: { type: Array, default: () => [] },
  variant: { type: String, default: "panel" },
});

const panelOpen = ref(false);
const customMessage = ref("");

function togglePanel() {
  panelOpen.value = !panelOpen.value;
}
function closePanel() {
  panelOpen.value = false;
}
function sendCustomMessage() {
  const msg = customMessage.value.trim();
  if (!msg) return;
  window.open(createWhatsAppUrl(msg, siteConfig), "_blank", "noopener,noreferrer");
  customMessage.value = "";
  closePanel();
}
function handleEsc(e) {
  if (e.key === "Escape") closePanel();
}
onMounted(() => document.addEventListener("keydown", handleEsc));
onBeforeUnmount(() => document.removeEventListener("keydown", handleEsc));

const defaultWhatsappUrl = createWhatsAppUrl(
  siteConfig.site.contact.whatsappDefaultMessage || "Hola",
  siteConfig,
);
</script>

<template>
  <div>
    <!-- Panel -->
    <Transition name="contact-panel">
      <section
        v-if="panelOpen && variant === 'panel'"
        class="whatsapp-panel"
        :style="{ '--contact-panel-background': `url(${coffeeFoam})` }"
        role="dialog"
        aria-modal="true"
        aria-label="Contacto por WhatsApp"
      >
        <header class="flex items-start justify-between">
          <div>
            <strong>{{ panelTitle }}</strong>
            <p>{{ panelDescription }}</p>
          </div>
          <button type="button" class="grid size-8 place-items-center rounded-full bg-white/15 text-white" aria-label="Cerrar" @click="closePanel">
            <SvgIcon name="close" :size="16" />
          </button>
        </header>
        <div class="panel-body space-y-3">
          <a
            v-for="q in questions"
            :key="q.label"
            class="question-link"
            :href="createWhatsAppUrl(q.message, siteConfig)"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SvgIcon name="whatsapp" :size="18" class="text-brand shrink-0" />
            <span>{{ q.label }}</span>
          </a>

          <div class="pt-3 border-t border-ink/10">
            <label class="text-xs font-bold uppercase tracking-wider text-muted">O escribe tu mensaje</label>
            <textarea
              v-model="customMessage"
              maxlength="240"
              rows="2"
              placeholder="Escribe aquí..."
              class="mt-2 w-full rounded-xl border border-ink/15 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            <div class="mt-1 flex items-center justify-between">
              <span class="text-xs text-muted">{{ customMessage.length }}/240</span>
              <button
                type="button"
                class="button button-primary !min-h-8 !px-4 !py-1.5 text-xs"
                :disabled="!customMessage.trim()"
                @click="sendCustomMessage"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      </section>
    </Transition>

    <!-- Botón flotante -->
    <a
      v-if="variant === 'simple'"
      class="floating-contact"
      :href="defaultWhatsappUrl"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
    >
      <SvgIcon name="whatsapp" :size="22" />
    </a>
    <button
      v-else
      type="button"
      class="floating-contact"
      :aria-expanded="panelOpen"
      aria-controls="whatsapp-panel"
      :aria-label="panelOpen ? 'Cerrar contacto' : 'Abrir contacto'"
      @click="togglePanel"
    >
      <SvgIcon v-if="!panelOpen" name="whatsapp" :size="22" />
      <SvgIcon v-else name="close" :size="20" />
    </button>
  </div>
</template>

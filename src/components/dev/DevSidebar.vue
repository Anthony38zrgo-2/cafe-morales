<script setup>
/**
 * DevSidebar — panel configurador solo DEV (localStorage v1)
 * - Tema: preset/palette curados, typography, radius, layout
 * - Secciones: enabled, order (drag), variant, props básicos
 * - Catálogo: CRUD + drag + visual
 * - Resizable + persistido localStorage
 * Montado solo si import.meta.env.DEV (tree-shaken en prod)
 */
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useDevConfig } from "@/composables/useDevConfig";
import { useCatalogStore } from "@/composables/useCatalogStore";
import { useSortable } from "@/composables/useSortable";
import { useResizable } from "@/composables/useResizable";
import { storageGet, storageSet, storageClearDev } from "@/composables/useStorage";
import { PALETTES, PALETTE_DEFINITIONS } from "@/config/palettes";
import { PRESETS, PRESET_META } from "@/config/presets";
import { SECTION_IDS, SECTION_VARIANTS } from "@/config/sections";
import SvgIcon from "@/components/ui/SvgIcon.vue";

// solo curadas (sin custom)
const curatedPalettes = PALETTES.filter((p) => p !== "custom");

const {
  state: devConfig,
  errors: getErrors,
  reset: resetConfig,
  downloadSiteConfig,
  pickLiveFile: pickSiteLive,
  saveToDisk: saveSiteToDisk,
  saveAs: saveSiteAs,
  forgetHandle: forgetSiteHandle,
  hasHandle: hasSiteHandle,
  handleName: siteHandleName,
  canUseFS: canSiteFS,
  isSaving: isSiteSaving,
} = useDevConfig();
const {
  state: catalog,
  addItem,
  duplicateItem,
  removeItem,
  reset: resetCatalog,
  downloadCatalog,
  pickLiveFile: pickCatalogLive,
  saveToDisk: saveCatalogToDisk,
  saveAs: saveCatalogAs,
  forgetHandle: forgetCatalogHandle,
  hasHandle: hasCatalogHandle,
  handleName: catalogHandleName,
  canUseFS: canCatalogFS,
  isSaving: isCatalogSaving,
} = useCatalogStore();
const canFS = canSiteFS && canCatalogFS;
const { width, onPointerDown, handleKey: handleResizeKey } = useResizable();

const open = ref(storageGet("sidebar_open", true));
const tab = ref(storageGet("sidebar_tab", "tema")); // tema | secciones | catalogo
const showPropsFor = ref(null); // id sección expandida

watch(open, (v) => storageSet("sidebar_open", v));
watch(tab, (v) => storageSet("sidebar_tab", v));

const errors = computed(() => getErrors());
const isValid = computed(() => errors.value.length === 0);

// Secciones ordenadas por order para drag visual (copia reactiva)
const sections = computed(() => devConfig.sections);
const orderedForDrag = computed(() =>
  [...sections.value].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
);

// Sortable para secciones (reordena devConfig.sections)
const sectionSortable = useSortable(sections, () => {
  // al soltar, recalcular order = index*10
  const orderedIds = orderedForDrag.value.map((s) => s.id);
  orderedIds.forEach((id, idx) => {
    const s = devConfig.sections.find((x) => x.id === id);
    if (s) s.order = idx * 10;
  });
});

// Sortable para catálogo
const catalogSortable = useSortable(catalog, () => {});

function toggleSection(id) {
  const s = devConfig.sections.find((x) => x.id === id);
  if (s) s.enabled = !s.enabled;
}

function moveSectionKb(index, dir) {
  sectionSortable.handleKeyMove(index, dir, orderedForDrag.value.length);
  // sincronizar order
  orderedForDrag.value.forEach((s, idx) => {
    const orig = devConfig.sections.find((x) => x.id === s.id);
    if (orig) orig.order = idx * 10;
  });
}

function copyConfig() {
  const text = JSON.stringify(devConfig, null, 2);
  navigator.clipboard?.writeText(text);
}

function downloadAll() {
  downloadSiteConfig();
  setTimeout(downloadCatalog, 300);
}

function resetAll() {
  if (!confirm("¿Resetear tema, secciones y catálogo a valores de src/config/site.config.js y src/data/catalog.json? Se borrará localStorage dev.")) return;
  resetConfig();
  resetCatalog();
  storageClearDev();
  location.reload();
}

function onKeydown(e) {
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "d") {
    open.value = !open.value;
    e.preventDefault();
  }
  if (e.key === "Escape" && open.value) {
    // no cerrar si hay modal abierto? cerrar sidebar si tiene foco
    const active = document.activeElement?.closest?.(".dev-sidebar");
    if (active) open.value = false;
  }
}

onMounted(() => window.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown));

// enfocador al abrir
watch(open, async (v) => {
  if (v) await nextTick(() => document.querySelector(".dev-sidebar [data-autofocus]")?.focus());
});

function sectionVariantOptions(id) {
  return SECTION_VARIANTS[id] || [];
}
</script>

<template>
  <div>
    <!-- Trigger fijo DEV -->
    <button
      v-if="!open"
      type="button"
      class="dev-trigger"
      aria-label="Abrir configurador DEV (Ctrl+Shift+D)"
      title="Abrir configurador DEV (Ctrl+Shift+D)"
      @click="open = true"
    >
      <SvgIcon name="menu" :size="18" />
      <span>DEV</span>
      <span v-if="!isValid" class="dev-badge-error">!</span>
    </button>

    <!-- Overlay + Sidebar -->
    <Teleport to="body">
      <div v-if="open" class="dev-overlay" @click.self="open = false">
        <aside
          class="dev-sidebar"
          :style="{ width: width + 'px' }"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dev-title"
          @pointermove="sectionSortable.onPointerMove"
          @pointerup="sectionSortable.endDrag(); catalogSortable.endDrag()"
        >
          <!-- header -->
          <header class="dev-header">
            <div>
              <h2 id="dev-title" class="dev-title">Configurador DEV</h2>
              <p class="dev-subtitle">2 JSON (base + live) · localStorage + disco manual · solo dev</p>
            </div>
            <div class="dev-header-actions">
              <span v-if="isValid" class="dev-valid">✓ válido</span>
              <span v-else class="dev-invalid">✗ {{ errors.length }}</span>
              <button type="button" class="dev-icon-btn" aria-label="Cerrar" @click="open = false">
                <SvgIcon name="close" :size="16" />
              </button>
            </div>
          </header>

          <!-- errores -->
          <div v-if="errors.length" class="dev-errors" role="alert">
            <strong>Errores validación:</strong>
            <ul>
              <li v-for="(e, i) in errors" :key="i">{{ e }}</li>
            </ul>
          </div>

          <!-- tabs -->
          <div class="dev-tabs" role="tablist">
            <button
              v-for="t in ['tema','secciones','catalogo']"
              :key="t"
              role="tab"
              :aria-selected="tab === t"
              :class="['dev-tab', tab === t ? 'active' : '']"
              @click="tab = t"
            >
              {{ t === 'tema' ? 'Tema' : t === 'secciones' ? 'Secciones' : 'Catálogo' }}
            </button>
          </div>

          <div class="dev-body">
            <!-- TEMA -->
            <section v-if="tab === 'tema'" class="dev-panel">
              <h3 class="dev-h3">Tema global</h3>

              <label class="dev-label">Preset
                <select v-model="devConfig.theme.preset" class="dev-select" data-autofocus>
                  <option v-for="p in PRESETS" :key="p" :value="p">{{ PRESET_META[p]?.label || p }} — {{ p }}</option>
                </select>
              </label>

              <label class="dev-label">Paleta (curadas)
                <select v-model="devConfig.theme.palette" class="dev-select">
                  <option v-for="p in curatedPalettes" :key="p" :value="p">{{ PALETTE_DEFINITIONS[p]?.label || p }} — {{ p }}</option>
                </select>
              </label>

              <div class="dev-palette-preview">
                <span
                  v-for="k in ['brand','accent','surface']"
                  :key="k"
                  class="dev-swatch"
                  :title="k"
                  :style="{ background: PALETTE_DEFINITIONS[devConfig.theme.palette]?.colors[k] || 'var(--color-'+k+')' }"
                />
                <span class="dev-muted">preview {{ devConfig.theme.palette }}</span>
              </div>

              <label class="dev-label">Tipografía
                <select :value="devConfig.theme.typography || ''" class="dev-select" @change="e => { const v = e.target.value; if (!v) delete devConfig.theme.typography; else devConfig.theme.typography = v; }">
                  <option value="">(usar fuente del preset)</option>
                  <option value="sans-display">sans-display — Inter + Fraunces</option>
                  <option value="display-heavy">display-heavy — Manrope + Barlow</option>
                  <option value="elegant">elegant — DM Sans + Cormorant</option>
                  <option value="mono">mono — JetBrains Mono</option>
                  <option value="editorial">editorial — DM Sans + Fraunces</option>
                  <option value="grotesk">grotesk — Space Grotesk</option>
                  <option value="serif-mono">serif-mono — Cormorant + JetBrains</option>
                  <option value="handmade">handmade — Plus Jakarta + Instrument</option>
                  <option value="corporate">corporate — Inter + Sora</option>
                  <option value="organic">organic — Plus Jakarta + Fraunces</option>
                  <option value="bauhaus">bauhaus — Poppins + Space Grotesk</option>
                  <option value="pastel">pastel — Poppins + Fraunces</option>
                </select>
              </label>
              <p class="dev-help">Vacío = usa la fuente definida por el preset (<code>PRESET_META</code>). Independiente.</p>

              <label class="dev-label">Radius
                <select v-model="devConfig.theme.radius" class="dev-select">
                  <option value="sm">sm</option>
                  <option value="md">md</option>
                  <option value="xl">xl</option>
                  <option value="2xl">2xl</option>
                  <option value="full">full</option>
                </select>
              </label>

              <div class="dev-row">
                <label class="dev-label">Container
                  <select v-model="devConfig.layout.container" class="dev-select">
                    <option value="sm">sm</option>
                    <option value="md">md</option>
                    <option value="lg">lg</option>
                    <option value="xl">xl</option>
                    <option value="7xl">7xl</option>
                  </select>
                </label>
                <label class="dev-label">Spacing
                  <select v-model="devConfig.layout.sectionSpacing" class="dev-select">
                    <option value="default">default</option>
                    <option value="compact">compact</option>
                    <option value="spacious">spacious</option>
                  </select>
                </label>
              </div>

              <label class="dev-label">SEO themeColor
                <input v-model="devConfig.site.seo.themeColor" type="text" placeholder="#4a1a2f" class="dev-input" />
              </label>

              <h4 class="dev-h4">Marca</h4>
              <label class="dev-label">Brand name
                <input v-model="devConfig.site.brand.name" class="dev-input" />
              </label>
              <label class="dev-label">Tagline
                <input v-model="devConfig.site.brand.tagline" class="dev-input" />
              </label>

              <h4 class="dev-h4">Contacto</h4>
              <label class="dev-label">Phone
                <input v-model="devConfig.site.contact.phone" class="dev-input" />
              </label>
              <label class="dev-label">WhatsApp msg
                <textarea v-model="devConfig.site.contact.whatsappDefaultMessage" rows="2" class="dev-textarea" />
              </label>

              <label class="dev-checkbox">
                <input v-model="devConfig.order.enabled" type="checkbox" />
                <span>order.enabled (muestra botón pedir / OrderModal)</span>
              </label>

              <div class="dev-card" style="margin-top:8px;">
                <h4 class="dev-h4">Persistencia disco — siteConfig (2 JSON)</h4>
                <p class="dev-help">Base: <code>src/config/site.config.js</code> (no modificado) · Live: <code>src/config/site.live.json</code> en disco (manual)</p>
                <div v-if="!canFS" class="dev-help" style="color:#b45309;">File System Access no disponible (requiere HTTPS + Chrome/Edge). Usa Descargar.</div>
                <template v-else>
                  <div class="dev-row-tight" style="margin:6px 0;">
                    <span class="dev-badge" :class="hasSiteHandle ? 'on' : 'off'">{{ hasSiteHandle ? 'Conectado' : 'Sin archivo' }}</span>
                    <span class="dev-muted" :title="siteHandleName">{{ siteHandleName || '—' }}</span>
                  </div>
                  <div class="dev-footer-row">
                    <button type="button" class="dev-btn ghost small" @click="pickSiteLive">Conectar live</button>
                    <button type="button" class="dev-btn primary small" :disabled="!hasSiteHandle || isSiteSaving" @click="saveSiteToDisk">{{ isSiteSaving ? 'Guardando…' : 'Guardar en disco' }}</button>
                  </div>
                  <div class="dev-footer-row">
                    <button type="button" class="dev-btn ghost small" @click="saveSiteAs">Guardar como…</button>
                    <button type="button" class="dev-btn ghost small" :disabled="!hasSiteHandle" @click="forgetSiteHandle">Olvidar</button>
                  </div>
                  <p class="dev-help">Manual: editas arriba y pulsas <b>Guardar en disco</b>. Reset solo borra localStorage.</p>
                </template>
              </div>
            </section>

            <!-- SECCIONES -->
            <section v-if="tab === 'secciones'" class="dev-panel">
              <h3 class="dev-h3">Zonas / Secciones — drag para orden</h3>
              <p class="dev-help">Arrastrar handle · Click ojo para mostrar/ocultar · Teclado: Espacio lift, ↑↓ mover</p>

              <div class="dev-list" role="list" @pointermove="sectionSortable.onPointerMove" @pointerup="sectionSortable.endDrag()">
                <div
                  v-for="(s, idx) in orderedForDrag"
                  :key="s.id"
                  class="dev-row-card"
                  :class="{ dragging: sectionSortable.dragging.value === idx, over: sectionSortable.over.value === idx }"
                  role="listitem"
                  :data-sort-index="idx"
                  :aria-grabbed="sectionSortable.dragging.value === idx"
                >
                  <button
                    type="button"
                    class="dev-handle"
                    :aria-label="`Arrastrar ${s.id}`"
                    @pointerdown="sectionSortable.startDrag(idx, $event)"
                    @keydown.space.prevent="sectionSortable.handleKeyMove(idx, 0, orderedForDrag.length)"
                    @keydown.arrow-up.prevent="moveSectionKb(idx, -1)"
                    @keydown.arrow-down.prevent="moveSectionKb(idx, 1)"
                  >
                    <SvgIcon name="menu" :size="14" />
                  </button>

                  <div class="dev-row-main">
                    <strong>{{ s.id }}</strong>
                    <span class="dev-muted">#{{ s.order }}</span>
                    <span :class="['dev-badge', s.enabled ? 'on' : 'off']">{{ s.enabled ? 'visible' : 'oculta' }}</span>
                    <span class="dev-muted">{{ s.variant }}</span>
                  </div>

                  <button type="button" class="dev-icon-btn small" :aria-label="s.enabled ? 'Ocultar' : 'Mostrar'" @click="toggleSection(s.id)">
                    <span v-if="s.enabled">👁</span><span v-else>🚫</span>
                  </button>

                  <select :value="s.variant" class="dev-select small" @change="s.variant = ($event.target).value">
                    <option v-for="v in sectionVariantOptions(s.id)" :key="v" :value="v">{{ v }}</option>
                    <option v-if="!sectionVariantOptions(s.id).length" :value="s.variant">{{ s.variant }}</option>
                  </select>

                  <button type="button" class="dev-icon-btn small" :aria-label="s.enabled ? 'Expandir props' : ''" @click="showPropsFor = showPropsFor === s.id ? null : s.id">
                    <SvgIcon name="search" :size="14" />
                  </button>
                </div>
              </div>

              <div v-if="showPropsFor" class="dev-props">
                <h4 class="dev-h4">Props de {{ showPropsFor }}</h4>
                <textarea
                  :value="JSON.stringify(devConfig.sections.find(x=>x.id===showPropsFor)?.props, null, 2)"
                  rows="8"
                  class="dev-textarea mono"
                  @change="e => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      const target = devConfig.sections.find(x=>x.id===showPropsFor);
                      if (target) target.props = parsed;
                    } catch(err){ alert('JSON inválido: '+err.message) }
                  }"
                />
                <p class="dev-help">Edita JSON y pulsa fuera para aplicar. Valida con `validateConfig`.</p>
              </div>

              <h4 class="dev-h4">Navegación</h4>
              <div v-for="(item, i) in devConfig.navigation" :key="i" class="dev-row-tight">
                <input v-model="item.label" placeholder="Label" class="dev-input" />
                <input v-model="item.href" placeholder="#catalog" class="dev-input" />
                <select v-model="item.section" class="dev-select small">
                  <option value="">(sin filtro)</option>
                  <option v-for="id in SECTION_IDS" :key="id" :value="id">{{ id }}</option>
                </select>
                <button type="button" class="dev-icon-btn small" @click="devConfig.navigation.splice(i,1)"><SvgIcon name="close" :size="12" /></button>
              </div>
              <button type="button" class="dev-btn ghost" @click="devConfig.navigation.push({label:'Nuevo', href:'#catalog', section:'catalog'})">+ Añadir link</button>
            </section>

            <!-- CATALOGO -->
            <section v-if="tab === 'catalogo'" class="dev-panel">
              <div class="dev-flex-between">
                <h3 class="dev-h3">Catálogo — drag</h3>
                <button type="button" class="dev-btn primary small" @click="addItem">+ Producto</button>
              </div>

              <div class="dev-list" role="list" @pointermove="catalogSortable.onPointerMove" @pointerup="catalogSortable.endDrag()">
                <div
                  v-for="(item, idx) in catalog"
                  :key="item.id"
                  class="dev-card"
                  :class="{ dragging: catalogSortable.dragging.value === idx }"
                  role="listitem"
                  :data-sort-index="idx"
                >
                  <div class="dev-card-head">
                    <button type="button" class="dev-handle" aria-label="Arrastrar producto" @pointerdown="catalogSortable.startDrag(idx, $event)">
                      <SvgIcon name="menu" :size="14" />
                    </button>
                    <strong>{{ item.name || '(sin nombre)' }}</strong>
                    <span class="dev-muted">{{ item.id }}</span>
                    <span class="dev-badge">{{ item.category }}</span>
                    <div class="dev-card-actions">
                      <button type="button" class="dev-icon-btn small" title="Duplicar" @click="duplicateItem(idx)">⧉</button>
                      <button type="button" class="dev-icon-btn small" title="Eliminar" @click="removeItem(idx)"><SvgIcon name="close" :size="12" /></button>
                    </div>
                  </div>

                  <div class="dev-grid2">
                    <label class="dev-label">ID <input v-model="item.id" class="dev-input" /></label>
                    <label class="dev-label">Category <input v-model="item.category" class="dev-input" /></label>
                  </div>
                  <label class="dev-label">Name <input v-model="item.name" class="dev-input" /></label>
                  <label class="dev-label">Description <textarea v-model="item.description" rows="2" class="dev-textarea" /></label>
                  <div class="dev-grid2">
                    <label class="dev-label">Price <input v-model="item.price" class="dev-input" /></label>
                    <label class="dev-label">Badge <input v-model="item.badge" class="dev-input" /></label>
                  </div>
                  <div class="dev-grid2">
                    <label class="dev-label">Visual type
                      <select v-model="item.visual.type" class="dev-select">
                        <option value="image">image</option>
                        <option value="svg">svg</option>
                      </select>
                    </label>
                    <label class="dev-label">Aspect <input v-model="item.visual.aspect" class="dev-input" placeholder="4 / 3" /></label>
                  </div>
                  <label class="dev-label">Visual alt / name
                    <input v-model="item.visual.alt" class="dev-input" placeholder="alt o name si svg" />
                  </label>
                  <div class="dev-row-tight">
                    <button type="button" class="dev-icon-btn small" title="Mover con teclado" @keydown.arrow-up.prevent="catalogSortable.handleKeyMove(idx,-1,catalog.length)" @keydown.arrow-down.prevent="catalogSortable.handleKeyMove(idx,1,catalog.length)">↕ teclado ↑↓</button>
                    <span class="dev-muted">#{{ idx }}</span>
                  </div>
                </div>
              </div>

              <div class="dev-card" style="margin-top:8px;">
                <h4 class="dev-h4">Persistencia disco — catálogo (2 JSON)</h4>
                <p class="dev-help">Base: <code>src/data/catalog.json</code> (no modificado) · Live: <code>src/data/catalog.live.json</code> en disco (manual)</p>
                <div v-if="!canFS" class="dev-help" style="color:#b45309;">File System Access no disponible.</div>
                <template v-else>
                  <div class="dev-row-tight" style="margin:6px 0;">
                    <span class="dev-badge" :class="hasCatalogHandle ? 'on' : 'off'">{{ hasCatalogHandle ? 'Conectado' : 'Sin archivo' }}</span>
                    <span class="dev-muted" :title="catalogHandleName">{{ catalogHandleName || '—' }}</span>
                  </div>
                  <div class="dev-footer-row">
                    <button type="button" class="dev-btn ghost small" @click="pickCatalogLive">Conectar live</button>
                    <button type="button" class="dev-btn primary small" :disabled="!hasCatalogHandle || isCatalogSaving" @click="saveCatalogToDisk">{{ isCatalogSaving ? 'Guardando…' : 'Guardar en disco' }}</button>
                  </div>
                  <div class="dev-footer-row">
                    <button type="button" class="dev-btn ghost small" @click="saveCatalogAs">Guardar como…</button>
                    <button type="button" class="dev-btn ghost small" :disabled="!hasCatalogHandle" @click="forgetCatalogHandle">Olvidar</button>
                  </div>
                  <p class="dev-help">Manual: no autosave a disco. Reset solo localStorage.</p>
                </template>
              </div>
            </section>
          </div>

          <!-- footer toolbar -->
          <footer class="dev-footer">
            <div class="dev-footer-row">
              <button type="button" class="dev-btn ghost" @click="copyConfig">Copiar siteConfig</button>
              <button type="button" class="dev-btn ghost" @click="resetAll">Reset</button>
            </div>
            <div class="dev-footer-row">
              <button type="button" class="dev-btn primary" @click="downloadAll">Descargar site.config.js + catalog.json</button>
            </div>
            <p class="dev-help">2 JSON: base <code>site.config.js</code>/<code>catalog.json</code> (no tocado) + live <code>site.live.json</code>/<code>catalog.live.json</code> en <code>src/data</code> (disco manual) · localStorage <code>dev:siteConfig</code> · Solo dev</p>
          </footer>
        </aside>

        <!-- resizer -->
        <div
          class="dev-resizer"
          role="separator"
          aria-orientation="vertical"
          :aria-valuenow="width"
          :aria-valuemin="280"
          :aria-valuemax="520"
          tabindex="0"
          aria-label="Redimensionar panel"
          @pointerdown="onPointerDown"
          @keydown="handleResizeKey"
        />
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.dev-trigger{ position:fixed; left:12px; bottom:12px; z-index:70; display:inline-flex; align-items:center; gap:6px; padding:8px 12px; border-radius:9999px; background:var(--color-ink); color:var(--color-surface); font-size:12px; font-weight:700; letter-spacing:.04em; box-shadow:0 4px 14px rgba(0,0,0,.25); cursor:pointer; }
.dev-badge-error{ background:#ef4444; color:#fff; border-radius:9999px; padding:0 6px; font-size:11px; }
.dev-overlay{ position:fixed; inset:0; z-index:69; display:flex; background:rgba(15,23,42,.32); backdrop-filter: blur(2px); }
.dev-sidebar{ background:var(--color-surface); border-right:1px solid color-mix(in srgb, var(--color-ink) 12%, transparent); display:flex; flex-direction:column; height:100vh; overflow:hidden; box-shadow: 8px 0 24px rgba(0,0,0,.12); }
.dev-resizer{ width:6px; cursor:col-resize; background:transparent; touch-action:none; flex-shrink:0; }
.dev-resizer:hover{ background:color-mix(in srgb, var(--color-brand) 18%, transparent); }
.dev-resizer:focus-visible{ outline:2px solid var(--color-accent); outline-offset:-2px; }
.dev-header{ display:flex; align-items:flex-start; justify-content:space-between; gap:12px; padding:14px 14px 10px; border-bottom:1px solid color-mix(in srgb, var(--color-ink) 8%, transparent); flex-shrink:0; }
.dev-title{ font-size:14px; font-weight:800; color:var(--color-ink); margin:0; }
.dev-subtitle{ font-size:11px; color:var(--color-muted); margin:2px 0 0; }
.dev-header-actions{ display:flex; align-items:center; gap:8px; }
.dev-valid{ font-size:11px; color:#16a34a; font-weight:700; }
.dev-invalid{ font-size:11px; color:#dc2626; font-weight:700; }
.dev-icon-btn{ display:grid; place-items:center; width:28px; height:28px; border-radius:9999px; border:1px solid color-mix(in srgb, var(--color-ink) 10%, transparent); background:var(--color-surface); cursor:pointer; }
.dev-icon-btn.small{ width:24px; height:24px; font-size:12px; }
.dev-errors{ background:#fef2f2; border:1px solid #fecaca; color:#991b1b; padding:8px 10px; font-size:12px; margin:8px 12px 0; border-radius:8px; }
.dev-errors ul{ margin:4px 0 0 16px; }
.dev-tabs{ display:flex; gap:6px; padding:10px 12px 0; border-bottom:1px solid color-mix(in srgb, var(--color-ink) 6%, transparent); flex-shrink:0; }
.dev-tab{ padding:6px 10px; border-radius:9999px; font-size:12px; font-weight:600; background:transparent; border:1px solid transparent; cursor:pointer; color:var(--color-muted); }
.dev-tab.active{ background:var(--color-ink); color:var(--color-surface); }
.dev-body{ flex:1; overflow:auto; padding:12px; display:flex; flex-direction:column; gap:14px; }
.dev-panel{ display:flex; flex-direction:column; gap:10px; }
.dev-h3{ font-size:13px; font-weight:800; color:var(--color-ink); margin:0; }
.dev-h4{ font-size:12px; font-weight:700; color:var(--color-ink); margin:8px 0 0; }
.dev-label{ display:flex; flex-direction:column; gap:4px; font-size:11px; font-weight:600; color:var(--color-ink); }
.dev-input, .dev-select, .dev-textarea{ border:1px solid color-mix(in srgb, var(--color-ink) 14%, transparent); background:var(--color-surface); color:var(--color-ink); border-radius:8px; padding:6px 8px; font-size:12px; outline:none; width:100%; }
.dev-input:focus, .dev-select:focus, .dev-textarea:focus{ border-color:var(--color-brand); box-shadow:0 0 0 2px color-mix(in srgb, var(--color-brand) 20%, transparent); }
.dev-textarea.mono{ font-family:ui-monospace, monospace; font-size:11px; }
.dev-row{ display:grid; grid-template-columns:1fr 1fr; gap:8px; }
.dev-row-tight{ display:flex; gap:6px; align-items:center; }
.dev-grid2{ display:grid; grid-template-columns:1fr 1fr; gap:8px; }
.dev-checkbox{ display:flex; align-items:center; gap:8px; font-size:12px; font-weight:600; cursor:pointer; }
.dev-help{ font-size:11px; color:var(--color-muted); margin:0; }
.dev-muted{ font-size:11px; color:var(--color-muted); }
.dev-palette-preview{ display:flex; gap:6px; align-items:center; }
.dev-swatch{ width:18px; height:18px; border-radius:9999px; border:1px solid rgba(0,0,0,.08); }
.dev-list{ display:flex; flex-direction:column; gap:8px; }
.dev-row-card{ display:flex; gap:8px; align-items:center; padding:8px; border:1px solid color-mix(in srgb, var(--color-ink) 8%, transparent); border-radius:10px; background:var(--color-surface); }
.dev-row-card.dragging{ opacity:.5; border-style:dashed; border-color:var(--color-brand); }
.dev-row-card.over{ outline:2px solid var(--color-accent); }
.dev-handle{ display:grid; place-items:center; width:26px; height:26px; border-radius:6px; background:var(--color-surfaceAlt); border:1px solid color-mix(in srgb, var(--color-ink) 8%, transparent); cursor:grab; touch-action:none; }
.dev-handle:active{ cursor:grabbing; }
.dev-row-main{ flex:1; display:flex; gap:6px; align-items:center; flex-wrap:wrap; font-size:12px; }
.dev-badge{ padding:2px 6px; border-radius:9999px; font-size:10px; font-weight:700; background:var(--color-surfaceAlt); border:1px solid color-mix(in srgb, var(--color-ink) 8%, transparent); }
.dev-badge.on{ background:var(--color-brand); color:var(--color-surface); }
.dev-badge.off{ background:#fee2e2; color:#991b1b; }
.dev-props{ border:1px dashed color-mix(in srgb, var(--color-ink) 12%, transparent); border-radius:8px; padding:8px; background:color-mix(in srgb, var(--color-surfaceAlt) 60%, transparent); }
.dev-card{ border:1px solid color-mix(in srgb, var(--color-ink) 8%, transparent); border-radius:10px; padding:10px; background:var(--color-surface); display:flex; flex-direction:column; gap:8px; }
.dev-card.dragging{ opacity:.5; border-style:dashed; border-color:var(--color-brand); }
.dev-card-head{ display:flex; gap:8px; align-items:center; font-size:12px; flex-wrap:wrap; }
.dev-card-actions{ margin-left:auto; display:flex; gap:4px; }
.dev-flex-between{ display:flex; align-items:center; justify-content:space-between; gap:8px; }
.dev-footer{ border-top:1px solid color-mix(in srgb, var(--color-ink) 8%, transparent); padding:10px 12px; display:flex; flex-direction:column; gap:8px; flex-shrink:0; background:color-mix(in srgb, var(--color-surfaceAlt) 40%, transparent); }
.dev-footer-row{ display:flex; gap:8px; }
.dev-btn{ padding:8px 12px; border-radius:9999px; font-size:12px; font-weight:700; cursor:pointer; border:1px solid transparent; flex:1; text-align:center; }
.dev-btn.ghost{ background:var(--color-surface); border-color:color-mix(in srgb, var(--color-ink) 12%, transparent); color:var(--color-ink); }
.dev-btn.primary{ background:var(--color-brand); color:var(--color-surface); border-color:var(--color-brand); }
.dev-btn.small{ padding:6px 10px; font-size:11px; }
@media (max-width: 720px){ .dev-sidebar{ width: 88vw !important; } .dev-resizer{ display:none; } }
</style>

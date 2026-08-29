<script setup>
/**
 * DevSidebar — panel configurador solo DEV (localStorage v1)
 * - Tema: galería visual de combos (preset × paleta), combos curados, favorito, A/B compare
 * - Secciones: enabled, order (drag), variant, props (form schema-driven o JSON avanzado)
 * - Catálogo: CRUD + drag + visual
 * - Atajos: Ctrl+Shift+D toggles · ↑/↓ preset · Shift+↑/↓ paleta · C A/B · Ctrl+Z / Ctrl+Y undo/redo
 * - Resizable + persistido localStorage
 * Montado solo si import.meta.env.DEV (tree-shaken en prod)
 */
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useDevConfig } from "@/composables/useDevConfig";
import { useCatalogStore } from "@/composables/useCatalogStore";
import { useSortable } from "@/composables/useSortable";
import { useResizable } from "@/composables/useResizable";
import { useHistory } from "@/composables/useHistory";
import { storageGet, storageSet, storageClearDev } from "@/composables/useStorage";
import { PALETTES, PALETTE_DEFINITIONS } from "@/config/palettes";
import { PRESETS, PRESET_META, CURATED_COMBOS } from "@/config/presets";
import { SECTION_IDS, SECTION_VARIANTS, SECTION_PROPS_SCHEMA } from "@/config/sections";
import { PARTNERS } from "@/data/partners";
import SvgIcon from "@/components/ui/SvgIcon.vue";
import DevComboPreview from "@/components/dev/DevComboPreview.vue";
import DevPropsEditor from "@/components/dev/DevPropsEditor.vue";

// solo curadas (sin custom)
const curatedPalettes = PALETTES.filter((p) => p !== "custom");

const {
  state: devConfig,
  errors: getErrors,
  reset: resetConfig,
  diffSummary,
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

// Undo/redo (memoria, máx 50 states)
const siteHistory = useHistory(devConfig);
const catalogHistory = useHistory(catalog);

// Blindaje: el tema siempre debe ser objeto (evita crash si el estado quedó sin theme).
if (!devConfig.theme) devConfig.theme = {};

const open = ref(storageGet("sidebar_open", true));
const tab = ref(storageGet("sidebar_tab", "tema")); // tema | secciones | catalogo
const temaView = ref(storageGet("sidebar_tema_view", "combinar")); // combinar | ajustes
const showPropsFor = ref(null); // id sección expandida
const propsAdvanced = ref(false); // JSON crudo vs formulario

// Galería: filtros
const presetFamilyFilter = ref("all");
const presetSearch = ref("");
const paletteFilter = ref("all"); // all | light | dark | pastel
const paletteSearch = ref("");

// Favorito del proyecto (combo preset × paleta)
const favorite = ref(storageGet("favorite_combo", null));
watch(favorite, (v) => storageSet("favorite_combo", v), { deep: true });

// A/B compare (tema)
const abSnapshot = ref(null);
const abActive = ref(false);

watch(open, (v) => storageSet("sidebar_open", v));
watch(tab, (v) => storageSet("sidebar_tab", v));
watch(temaView, (v) => storageSet("sidebar_tema_view", v));

const errors = computed(() => getErrors());
const isValid = computed(() => errors.value.length === 0);
const changedPaths = computed(() => diffSummary());

/** Familias de paleta por sufijo (light | dark | pastel) */
function paletteFamily(id) {
  if (id.endsWith("-pastel")) return "pastel";
  if (id.endsWith("-dark")) return "dark";
  return "light";
}

/**
 * Presets filtrados (familias en PRESET_META[s].family)
 * "all" por defecto hasta que el usuario filtra; red = los 8 más distintos.
 */
const presetFamilies = computed(() => {
  const set = new Set(PRESETS.map((p) => PRESET_META[p]?.family || "otros"));
  return [...set].filter((f) => f !== "otros");
});

const filteredPresets = computed(() => {
  let list = [...PRESETS];
  if (presetFamilyFilter.value !== "all") {
    list = list.filter((p) => PRESET_META[p]?.family === presetFamilyFilter.value);
  }
  if (presetSearch.value.trim()) {
    const q = presetSearch.value.trim().toLowerCase();
    list = list.filter((p) =>
      ((PRESET_META[p]?.label || p) + " " + (PRESET_META[p]?.description || "")).toLowerCase().includes(q),
    );
  }
  return list;
});

const filteredPalettes = computed(() => {
  let list = [...curatedPalettes];
  if (paletteFilter.value !== "all") {
    list = list.filter((p) => paletteFamily(p) === paletteFilter.value);
  }
  if (paletteSearch.value.trim()) {
    const q = paletteSearch.value.trim().toLowerCase();
    list = list.filter((p) =>
      ((PALETTE_DEFINITIONS[p]?.label || p) + " " + (PALETTE_DEFINITIONS[p]?.description || "")).toLowerCase().includes(q),
    );
  }
  return list;
});

const selectedCombo = computed(() => ({
  preset: devConfig.theme.preset,
  palette: devConfig.theme.palette,
}));

const favoriteApplied = computed(
  () =>
    favorite.value &&
    favorite.value.preset === devConfig.theme.preset &&
    favorite.value.palette === devConfig.theme.palette,
);

function isFavorite(combo) {
  return favorite.value?.preset === combo.preset && favorite.value?.palette === combo.palette;
}

function applyThemePair(preset, palette) {
  if (preset) devConfig.theme.preset = preset;
  if (palette) devConfig.theme.palette = palette;
}

function toggleFavorite(combo) {
  favorite.value = isFavorite(combo) ? null : { ...combo };
}

function applyFavorite() {
  if (favorite.value) applyThemePair(favorite.value.preset, favorite.value.palette);
}

function cyclePreset(dir) {
  const idx = PRESETS.indexOf(devConfig.theme.preset);
  const next = (idx + dir + PRESETS.length) % PRESETS.length;
  devConfig.theme.preset = PRESETS[next];
}

function cyclePalette(dir) {
  const idx = curatedPalettes.indexOf(devConfig.theme.palette);
  const next = (idx + dir + curatedPalettes.length) % curatedPalettes.length;
  devConfig.theme.palette = curatedPalettes[next];
}

// A/B compare — snapshot del theme y toggle
function cloneTheme() {
  return JSON.parse(JSON.stringify(devConfig.theme));
}

function toggleAB() {
  if (!abSnapshot.value) {
    abSnapshot.value = cloneTheme();
    abActive.value = false;
    return;
  }
  const current = cloneTheme();
  Object.keys(devConfig.theme).forEach((k) => delete devConfig.theme[k]);
  Object.assign(devConfig.theme, abSnapshot.value);
  abSnapshot.value = current;
  abActive.value = !abActive.value;
}

function clearAB() {
  abSnapshot.value = null;
  abActive.value = false;
}

function isABReady() {
  return Boolean(abSnapshot.value);
}

// Undo/redo contextual al tab activo
function undo() {
  if (tab.value === "catalogo") catalogHistory.undo();
  else siteHistory.undo();
}
function redo() {
  if (tab.value === "catalogo") catalogHistory.redo();
  else siteHistory.redo();
}
const canUndo = computed(() =>
  tab.value === "catalogo" ? catalogHistory.canUndo.value : siteHistory.canUndo.value,
);
const canRedo = computed(() =>
  tab.value === "catalogo" ? catalogHistory.canRedo.value : siteHistory.canRedo.value,
);

// Secciones ordenadas por order para drag visual (copia reactiva)
const sections = computed(() => devConfig.sections);
const orderedForDrag = computed(() =>
  [...sections.value].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
);

// Sortable para secciones (reordena devConfig.sections)
const sectionSortable = useSortable(sections, () => {
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
  if (!confirm("¿Resetear tema, secciones y catálogo a valores de src/config/site.config.js y src/data/catalog.json? Se borrará localStorage dev y los archivos live conectados.")) return;
  resetConfig();
  resetCatalog();
  forgetSiteHandle();
  forgetCatalogHandle();
  storageClearDev();
  location.reload();
}

function onKeydown(e) {
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "d") {
    open.value = !open.value;
    e.preventDefault();
    return;
  }
  if (!open.value) return;
  const t = e.target;
  const typing = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable);

  // Undo/redo global (incluso con foco en inputs — el editor JSON no tiene undo propio)
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !e.shiftKey) {
    e.preventDefault();
    undo();
    return;
  }
  if ((e.ctrlKey || e.metaKey) && ((e.shiftKey && e.key.toLowerCase() === "z") || e.key.toLowerCase() === "y")) {
    e.preventDefault();
    redo();
    return;
  }

  if (typing) return;

  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    e.preventDefault();
    const dir = e.key === "ArrowUp" ? -1 : 1;
    if (e.shiftKey) cyclePalette(dir);
    else cyclePreset(dir);
    return;
  }
  if (e.key.toLowerCase() === "c") {
    e.preventDefault();
    toggleAB();
    return;
  }
  if (e.key === "Escape") {
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

/** Localiza la sección en la página (flash + scroll) */
function focusSection(id) {
  const el = document.querySelector(`[data-dev-section="${id}"]`);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  el.setAttribute("data-dev-flash", "1");
  setTimeout(() => el.removeAttribute("data-dev-flash"), 1800);
}

function sectionProps(id) {
  const s = devConfig.sections.find((x) => x.id === id);
  if (!s) return null;
  if (!s.props) s.props = {};
  return s.props;
}

function propsSchema(id) {
  return SECTION_PROPS_SCHEMA[id] || {};
}

function applyPropsJson(id, raw) {
  try {
    const parsed = JSON.parse(raw);
    const target = devConfig.sections.find((x) => x.id === id);
    if (target) target.props = parsed;
  } catch {
    // ignorar mientras escribe; alerts quedan fuera
  }
}

function themeColorInput(value) {
  devConfig.site.seo.themeColor = value;
}

function addPresentation(item) {
  if (!Array.isArray(item.presentations)) item.presentations = [];
  item.presentations.push({ unit: "250 g", price: 0, image: "" });
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
              <div class="dev-header-meta">
                <span v-if="isValid" class="dev-valid">✓ válido</span>
                <span v-else class="dev-invalid">✗ {{ errors.length }}</span>
                <span v-if="changedPaths.length" class="dev-diff">
                  {{ changedPaths.length }} cambios vs base
                </span>
                <span v-else class="dev-diff none">sin cambios vs base</span>
                <span v-if="favoriteApplied" class="dev-valid" title="Combo favorito activo">★ favorito</span>
              </div>
            </div>
            <button type="button" class="dev-icon-btn" aria-label="Cerrar" @click="open = false">
              <SvgIcon name="close" :size="16" />
            </button>
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
              <!-- sub-tabs -->
              <div class="dev-tabs small">
                <button
                  type="button"
                  :class="['dev-tab', temaView === 'combinar' ? 'active' : '']"
                  @click="temaView = 'combinar'"
                >
                  Combinar
                </button>
                <button
                  type="button"
                  :class="['dev-tab', temaView === 'ajustes' ? 'active' : '']"
                  @click="temaView = 'ajustes'"
                >
                  Ajustes
                </button>
              </div>

              <template v-if="temaView === 'combinar'">
                <!-- A/B + favorito launcher -->
                <div class="dev-row">
                  <button
                    type="button"
                    class="dev-btn ghost small"
                    :class="{ hot: abActive }"
                    :title="abSnapshot ? 'Alterna snapshot ↔ actual (tecla C)' : 'Toma una foto del tema actual para comparar'"
                    @click="toggleAB"
                  >
                    {{ !isABReady() ? '📸 Foto A' : abActive ? 'A ⇄ B (B activo)' : 'A ⇄ B (A activo)' }}
                  </button>
                  <button
                    type="button"
                    class="dev-btn ghost small"
                    :disabled="!favorite"
                    @click="applyFavorite"
                  >
                    ★ Aplicar favorito
                  </button>
                  <button type="button" class="dev-icon-btn small" title="Limpiar A/B" @click="clearAB">✕</button>
                </div>

                <p class="dev-help">Atajos: ↑↓ preset · Shift ↑↓ paleta · C A/B · Ctrl+Z undo · Ctrl+Y redo</p>

                <!-- Combos curados -->
                <h4 class="dev-h4">Combos curados</h4>
                <div class="dev-gallery combos">
                  <div
                    v-for="combo in CURATED_COMBOS"
                    :key="combo.preset + combo.palette"
                    class="dev-gallery-card"
                    :class="{ active: selectedCombo.preset === combo.preset && selectedCombo.palette === combo.palette }"
                    role="button"
                    tabindex="0"
                    :aria-label="`Aplicar ${combo.label}`"
                    @click="applyThemePair(combo.preset, combo.palette)"
                    @keydown.enter="applyThemePair(combo.preset, combo.palette)"
                  >
                    <DevComboPreview :preset="combo.preset" :palette="combo.palette" compact />
                    <div class="g-name">
                      <span>{{ combo.label }}</span>
                      <button
                        type="button"
                        class="dev-star"
                        :class="{ on: isFavorite(combo) }"
                        :title="isFavorite(combo) ? 'Quitar favorito' : 'Marcar favorito'"
                        @click.stop="toggleFavorite(combo)"
                      >
                        {{ isFavorite(combo) ? '★' : '☆' }}
                      </button>
                    </div>
                    <p class="dev-help">{{ combo.note }}</p>
                  </div>
                </div>

                <!-- Galería presets -->
                <div class="dev-flex-between" style="margin-top: 6px;">
                  <h4 class="dev-h4">Presets ({{ filteredPresets.length }})</h4>
                  <button type="button" class="dev-icon-btn small" title="Filtrar por familia" @click="presetFamilyFilter = presetFamilyFilter === 'all' ? 'warm' : 'all'">⚙</button>
                </div>
                <div class="dev-row-tight">
                  <input v-model="presetSearch" class="dev-input" placeholder="Buscar preset…" data-autofocus />
                  <select v-model="presetFamilyFilter" class="dev-select small" aria-label="Filtrar por familia">
                    <option value="all">todas</option>
                    <option v-for="f in presetFamilies" :key="f" :value="f">{{ f }}</option>
                  </select>
                </div>
                <div class="dev-gallery">
                  <div
                    v-for="p in filteredPresets"
                    :key="p"
                    class="dev-gallery-card"
                    :class="{ active: selectedCombo.preset === p }"
                    role="button"
                    tabindex="0"
                    :aria-label="`Aplicar preset ${p}`"
                    @click="applyThemePair(p, null)"
                    @keydown.enter="applyThemePair(p, null)"
                  >
                    <DevComboPreview :preset="p" :palette="selectedCombo.palette" compact />
                    <div class="g-name">
                      <span>{{ PRESET_META[p]?.label || p }}</span>
                      <button
                        type="button"
                        class="dev-star"
                        :class="{ on: isFavorite({ preset: p, palette: selectedCombo.palette }) }"
                        @click.stop="toggleFavorite({ preset: p, palette: selectedCombo.palette })"
                      >
                        {{ isFavorite({ preset: p, palette: selectedCombo.palette }) ? '★' : '☆' }}
                      </button>
                    </div>
                    <p class="dev-help">{{ PRESET_META[p]?.signature }}</p>
                  </div>
                </div>

                <!-- Galería paletas -->
                <h4 class="dev-h4">Paletas ({{ filteredPalettes.length }})</h4>
                <div class="dev-row-tight">
                  <input v-model="paletteSearch" class="dev-input" placeholder="Buscar paleta…" />
                  <select v-model="paletteFilter" class="dev-select small" aria-label="Filtrar paletas">
                    <option value="all">todas</option>
                    <option value="light">light</option>
                    <option value="dark">dark</option>
                    <option value="pastel">pastel</option>
                  </select>
                </div>
                <div class="dev-gallery">
                  <div
                    v-for="p in filteredPalettes"
                    :key="p"
                    class="dev-gallery-card"
                    :class="{ active: selectedCombo.palette === p }"
                    role="button"
                    tabindex="0"
                    :aria-label="`Aplicar paleta ${p}`"
                    @click="applyThemePair(null, p)"
                    @keydown.enter="applyThemePair(null, p)"
                  >
                    <DevComboPreview :preset="selectedCombo.preset" :palette="p" compact />
                    <div class="g-name">
                      <span>{{ PALETTE_DEFINITIONS[p]?.label || p }}</span>
                      <button
                        type="button"
                        class="dev-star"
                        :class="{ on: isFavorite({ preset: selectedCombo.preset, palette: p }) }"
                        @click.stop="toggleFavorite({ preset: selectedCombo.preset, palette: p })"
                      >
                        {{ isFavorite({ preset: selectedCombo.preset, palette: p }) ? '★' : '☆' }}
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Swatch detalle del combo activo -->
                <div class="dev-card" style="margin-top: 8px;">
                  <h4 class="dev-h4">Swatches — {{ selectedCombo.preset }} × {{ selectedCombo.palette }}</h4>
                  <div class="dev-swatches">
                    <span
                      v-for="k in ['ink','muted','surface','surfaceAlt','brand','brandDark','accent']"
                      :key="k"
                      class="dev-swatch"
                      :title="`${k}: ${PALETTE_DEFINITIONS[selectedCombo.palette]?.colors[k] || 'var(--color-' + k + ')'}`"
                      :style="{ background: PALETTE_DEFINITIONS[selectedCombo.palette]?.colors[k] || 'var(--color-'+k+')' }"
                    />
                  </div>
                  <p class="dev-help">Paleta curada {{ selectedCombo.palette }} · preview via CSS vars (previews aplican la firma del preset)</p>
                </div>
              </template>

              <template v-else>
                <!-- AJUSTES -->
                <h3 class="dev-h3">Ajustes del tema</h3>

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
                    <option value="">(según preset)</option>
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
                  <input :value="devConfig.site.seo.themeColor" type="text" placeholder="#d97706" class="dev-input" @input="themeColorInput($event.target.value)" />
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

                <h4 class="dev-h4">Lista de cambios vs base</h4>
                <div class="dev-diff-list">
                  <span v-for="path in changedPaths" :key="path" class="dev-muted">· {{ path }}</span>
                  <span v-if="!changedPaths.length" class="dev-muted">— igual al site.config.js</span>
                </div>
              </template>

              <div class="dev-card" style="margin-top: 8px;">
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
              <p class="dev-help">Arrastrar handle · Click ojo para mostrar/ocultar · Click 🔎 para editar props · Click ⌖ para localizar en página · Teclado: Espacio lift, ↑↓ mover</p>

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
                  <button type="button" class="dev-icon-btn small" title="Localizar en página" @click="focusSection(s.id)">⌖</button>

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
                <div class="dev-props-head">
                  <h4 class="dev-h4">Props de {{ showPropsFor }}</h4>
                  <div class="dev-row-tight">
                    <button type="button" class="dev-icon-btn small" title="Localizar" @click="focusSection(showPropsFor)">⌖</button>
                    <button type="button" class="dev-btn ghost small" @click="propsAdvanced = !propsAdvanced">
                      {{ propsAdvanced ? 'Formulario' : 'JSON crudo' }}
                    </button>
                  </div>
                </div>

                <DevPropsEditor
                  v-if="!propsAdvanced"
                  :section-id="showPropsFor"
                  :schema="propsSchema(showPropsFor)"
                  :props-obj="sectionProps(showPropsFor) || {}"
                />

                <template v-else>
                  <textarea
                    :value="JSON.stringify(sectionProps(showPropsFor), null, 2)"
                    rows="10"
                    class="dev-textarea mono"
                    @change="e => applyPropsJson(showPropsFor, e.target.value)"
                  />
                  <p class="dev-help">Edita JSON y pulsa fuera para aplicar. Ctrl+Z deshace.</p>
                </template>
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
                  <div class="dev-grid2">
                    <label class="dev-label">Gama
                      <select v-model="item.gama" class="dev-select">
                        <option value="clasico">clasico</option>
                        <option value="premium">premium</option>
                        <option value="otros">otros</option>
                      </select>
                    </label>
                    <label class="dev-label">Partner
                      <select v-model="item.partnerId" class="dev-select">
                        <option v-for="p in PARTNERS" :key="p.id" :value="p.id">{{ p.brand }}</option>
                        <option value="">(sin partner)</option>
                      </select>
                    </label>
                  </div>
                  <label class="dev-label">Name <input v-model="item.name" class="dev-input" /></label>
                  <label class="dev-label">Description <textarea v-model="item.description" rows="2" class="dev-textarea" /></label>
                  <div class="dev-grid2">
                    <label class="dev-label">Price <input v-model="item.price" class="dev-input" /></label>
                    <label class="dev-label">Badge <input v-model="item.badge" class="dev-input" /></label>
                  </div>
                  <div class="dev-label">
                    Flags (coma)
                    <input
                      :value="(item.flags || []).join(', ')"
                      class="dev-input"
                      @change="item.flags = $event.target.value.split(',').map(s => s.trim()).filter(Boolean)"
                    />
                  </div>

                  <div class="dev-subhead">
                    <span>Presentaciones</span>
                    <button type="button" class="dev-icon-btn small" title="Añadir presentación" @click="addPresentation(item)">+</button>
                  </div>
                  <div v-for="(p, pi) in item.presentations" :key="pi" class="dev-grid2">
                    <label class="dev-label">Unit <input v-model="p.unit" class="dev-input" placeholder="250 g" /></label>
                    <label class="dev-label">
                      Price
                      <span class="dev-row-tight">
                        <input v-model.number="p.price" type="number" min="0" step="0.1" class="dev-input" />
                        <button type="button" class="dev-icon-btn small" title="Quitar presentación" @click="item.presentations.splice(pi,1)">
                          <SvgIcon name="close" :size="12" />
                        </button>
                      </span>
                    </label>
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
              <button type="button" class="dev-btn ghost small" :disabled="!canUndo" title="Ctrl+Z" @click="undo">↩ undo</button>
              <button type="button" class="dev-btn ghost small" :disabled="!canRedo" title="Ctrl+Y" @click="redo">↪ redo</button>
              <button type="button" class="dev-btn ghost small" @click="copyConfig">Copiar siteConfig</button>
              <button type="button" class="dev-btn ghost small" @click="resetAll">Reset</button>
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
.dev-header-meta{ display:flex; flex-wrap:wrap; gap:8px; align-items:center; margin-top:4px; }
.dev-header-actions{ display:flex; align-items:center; gap:8px; }
.dev-valid{ font-size:11px; color:#16a34a; font-weight:700; }
.dev-invalid{ font-size:11px; color:#dc2626; font-weight:700; }
.dev-diff{ font-size:10.5px; color:#92400e; font-weight:700; background:#fffbeb; border-radius:9999px; padding:1px 8px; }
.dev-diff.none{ color:var(--color-muted); font-weight:600; background:transparent; }
.dev-icon-btn{ display:grid; place-items:center; width:28px; height:28px; border-radius:9999px; border:1px solid color-mix(in srgb, var(--color-ink) 10%, transparent); background:var(--color-surface); cursor:pointer; }
.dev-icon-btn.small{ width:24px; height:24px; font-size:12px; }
.dev-errors{ background:#fef2f2; border:1px solid #fecaca; color:#991b1b; padding:8px 10px; font-size:12px; margin:8px 12px 0; border-radius:8px; }
.dev-errors ul{ margin:4px 0 0 16px; }
.dev-tabs{ display:flex; gap:6px; padding:10px 12px 0; border-bottom:1px solid color-mix(in srgb, var(--color-ink) 6%, transparent); flex-shrink:0; }
.dev-tabs.small{ padding:4px 0 8px; border-bottom:none; }
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
.dev-subhead{ display:flex; align-items:center; justify-content:space-between; margin-top:4px; font-size:11px; font-weight:800; color:var(--color-ink); text-transform:uppercase; letter-spacing:.05em; }
.dev-checkbox{ display:flex; align-items:center; gap:8px; font-size:12px; font-weight:600; cursor:pointer; }
.dev-help{ font-size:11px; color:var(--color-muted); margin:0; }
.dev-muted{ font-size:11px; color:var(--color-muted); }
.dev-swatches{ display:flex; gap:6px; align-items:center; flex-wrap:wrap; }
.dev-swatch{ width:20px; height:20px; border-radius:9999px; border:1px solid rgba(0,0,0,.08); }
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
.dev-props-head{ display:flex; align-items:center; justify-content:space-between; gap:8px; }
.dev-card{ border:1px solid color-mix(in srgb, var(--color-ink) 8%, transparent); border-radius:10px; padding:10px; background:var(--color-surface); display:flex; flex-direction:column; gap:8px; }
.dev-card.dragging{ opacity:.5; border-style:dashed; border-color:var(--color-brand); }
.dev-card-head{ display:flex; gap:8px; align-items:center; font-size:12px; flex-wrap:wrap; }
.dev-card-actions{ margin-left:auto; display:flex; gap:4px; }
.dev-flex-between{ display:flex; align-items:center; justify-content:space-between; gap:8px; }
.dev-gallery{ display:grid; grid-template-columns:repeat(auto-fill, minmax(150px, 1fr)); gap:8px; }
.dev-gallery.combos{ grid-template-columns:repeat(auto-fill, minmax(160px, 1fr)); }
.dev-gallery-card{ cursor:pointer; border:1px solid color-mix(in srgb, var(--color-ink) 10%, transparent); border-radius:10px; padding:5px; background:var(--color-surface); display:flex; flex-direction:column; gap:3px; transition:border-color .15s, box-shadow .15s; }
.dev-gallery-card:hover{ border-color:var(--color-brand); }
.dev-gallery-card.active{ border-color:var(--color-accent); box-shadow:0 0 0 2px color-mix(in srgb, var(--color-accent) 35%, transparent); }
.g-name{ display:flex; justify-content:space-between; align-items:center; gap:4px; font-size:10.5px; font-weight:700; color:var(--color-ink); padding:0 2px; }
.dev-star{ border:none; background:transparent; cursor:pointer; font-size:12px; color:var(--color-muted); padding:0 2px; }
.dev-star.on{ color:#d97706; }
.dev-btn.hot{ border-color:var(--color-accent); color:var(--color-accent); background:color-mix(in srgb, var(--color-accent) 10%, transparent); }
.dev-diff-list{ display:flex; flex-direction:column; gap:2px; max-height:120px; overflow:auto; }
.dev-footer{ border-top:1px solid color-mix(in srgb, var(--color-ink) 8%, transparent); padding:10px 12px; display:flex; flex-direction:column; gap:8px; flex-shrink:0; background:color-mix(in srgb, var(--color-surfaceAlt) 40%, transparent); }
.dev-footer-row{ display:flex; gap:8px; }
.dev-btn{ padding:8px 12px; border-radius:9999px; font-size:12px; font-weight:700; cursor:pointer; border:1px solid transparent; flex:1; text-align:center; }
.dev-btn.ghost{ background:var(--color-surface); border-color:color-mix(in srgb, var(--color-ink) 12%, transparent); color:var(--color-ink); }
.dev-btn.primary{ background:var(--color-brand); color:var(--color-surface); border-color:var(--color-brand); }
.dev-btn.small{ padding:6px 10px; font-size:11px; }
.dev-btn:disabled{ opacity:.45; cursor:not-allowed; }
@media (max-width: 720px){ .dev-sidebar{ width: 88vw !important; } .dev-resizer{ display:none; } }
</style>

<style>
/* Globales dev (no scoped) — flash de sección localizada */
[data-dev-section][data-dev-flash] {
  outline: 3px dashed var(--color-accent) !important;
  outline-offset: 6px;
  border-radius: 6px;
  transition: outline-color .2s;
}
</style>

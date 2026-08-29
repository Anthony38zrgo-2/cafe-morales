<script setup>
/**
 * DevComboPreview — mini-maqueta del sitio renderizada con las CSS vars
 * del par preset × palette (atributos data-preset/data-palette en wrapper).
 * Usa las clases reales (.display-title/.eyebrow/.button/.catalog-card/
 * .visual-placeholder) para que las reglas de firma de cada preset apliquen.
 */
defineProps({
  preset: { type: String, required: true },
  palette: { type: String, required: true },
  compact: { type: Boolean, default: false },
});
</script>

<template>
  <div class="cp" :data-preset="preset" :data-palette="palette" aria-hidden="true">
    <div class="cp-site">
      <div class="cp-header">
        <span class="cp-brand"></span>
        <span class="cp-nav"><i></i><i></i><i></i></span>
      </div>
      <div class="cp-hero">
        <span class="cp-eyebrow eyebrow">señal</span>
        <span class="cp-title display-title">Título</span>
        <span v-if="!compact" class="cp-btn button button-primary">Acción</span>
      </div>
      <div class="catalog-card cp-card">
        <div class="visual-placeholder cp-visual"><span>IMG</span></div>
        <div class="cp-body">
          <span class="cp-line w70"></span>
          <span class="cp-line w45"></span>
        </div>
      </div>
      <p v-if="!compact" class="cp-tagline">lorem ipsum dolor</p>
    </div>
  </div>
</template>

<style scoped>
.cp {
  display: block;
  min-width: 0;
}
.cp-site {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  background: var(--color-surface);
  overflow: hidden;
  pointer-events: none;
  user-select: none;
}
.cp-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}
.cp-brand {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--color-brand);
}
.cp-nav {
  display: inline-flex;
  gap: 3px;
}
.cp-nav i {
  display: block;
  width: 12px;
  height: 3px;
  border-radius: 2px;
  background: color-mix(in srgb, var(--color-ink) 25%, transparent);
}
.cp-hero {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
}
.cp-eyebrow {
  margin: 0 !important;
  max-width: 100%;
}
.cp-title {
  font-size: 13px;
  line-height: 1.05;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 !important;
}
.cp-btn {
  min-height: 0 !important;
  padding: 3px 8px !important;
  font-size: 9px !important;
  margin-top: 2px;
}
.cp-card {
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-card);
}
.cp-visual {
  height: 34px;
  padding: 0 !important;
  border-radius: calc(var(--radius-visual) * 0.6);
}
.cp-visual span {
  font-size: 7px !important;
  max-width: none !important;
}
.cp-body {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 4px 5px;
}
.cp-line {
  display: block;
  height: 3px;
  border-radius: 2px;
  background: color-mix(in srgb, var(--color-ink) 18%, transparent);
}
.cp-line.w70 { width: 70%; }
.cp-line.w45 { width: 45%; }
.cp-tagline {
  font-size: 8px;
  color: var(--color-muted);
  margin: 0;
}
</style>

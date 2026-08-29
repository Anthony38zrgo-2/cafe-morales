<script setup>
/**
 * DevPropsEditor — editor de props por formulario (schema-driven)
 * Tipos: text | textarea | select | check | visual | list | textlist
 * Muta `props` en sitio (identidad estable) — sin alert().
 * Nota lint: propsObj es una referencia compartida del config reactivo;
 * se muta en sitio para que la UI del sitio se actualice al instante.
 */
/* eslint-disable vue/no-mutating-props */
const props = defineProps({
  sectionId: { type: String, required: true },
  schema: { type: Object, default: () => ({}) },
  propsObj: { type: Object, required: true },
});

const visualSchema = {
  type: { type: "select", label: "Tipo", options: ["svg", "image", "model"] },
  name: { type: "text", label: "Nombre / src" },
  aspect: { type: "text", label: "Aspect" },
  alt: { type: "text", label: "Alt" },
};

function set(key, value) {
  if (value === "" || value === null || value === undefined) {
    delete props.propsObj[key];
  } else {
    props.propsObj[key] = value;
  }
}

function get(key) {
  return props.propsObj[key];
}

function ensure(key, def) {
  if (!props.propsObj[key]) props.propsObj[key] = def;
  return props.propsObj[key];
}

function setVisual(fkey, value) {
  if (!get("visual")) props.propsObj.visual = {};
  props.propsObj.visual[fkey] = value || undefined;
}

function setTextAt(field, index, value) {
  const list = ensure(field, []);
  list[index] = value;
}

function addItem(field) {
  const list = ensure(field, []);
  const item = Object.fromEntries(
    Object.entries(props.schema[field].item || {}).map(([k, spec]) => [k, spec.type === "textarea" ? "" : ""]),
  );
  list.push(item);
}

function removeItem(field, index) {
  ensure(field, []).splice(index, 1);
}

function addText(field) {
  ensure(field, []).push("");
}

function removeText(field, index) {
  ensure(field, []).splice(index, 1);
}

function hasField(key) {
  return Object.prototype.hasOwnProperty.call(props.propsObj, key);
}

function deleteField(key) {
  delete props.propsObj[key];
}
</script>

<template>
  <div class="pe">
    <div v-for="(spec, key) in schema" :key="key" class="pe-field">
      <label v-if="spec.type === 'text'" class="pe-label">
        {{ spec.label }}<small v-if="spec.required" class="pe-req">*</small>
        <input
          type="text"
          class="pe-input mono"
          :class="{ invalid: spec.required && !hasField(key) }"
          :value="get(key) ?? ''"
          :placeholder="spec.placeholder || ''"
          @input="set(key, $event.target.value)"
        />
      </label>

      <label v-else-if="spec.type === 'textarea'" class="pe-label">
        {{ spec.label }}<small v-if="spec.required" class="pe-req">*</small>
        <textarea
          rows="2"
          class="pe-input"
          :class="{ invalid: spec.required && !hasField(key) }"
          :value="get(key) ?? ''"
          @input="set(key, $event.target.value)"
        />
      </label>

      <label v-else-if="spec.type === 'select'" class="pe-label">
        {{ spec.label }}
        <select class="pe-input" :value="get(key) ?? ''" @change="set(key, $event.target.value)">
          <option value="">(sin)</option>
          <option v-for="o in spec.options" :key="o" :value="o">{{ o }}</option>
        </select>
      </label>

      <label v-else-if="spec.type === 'check'" class="pe-check">
        <input type="checkbox" :checked="get(key) === true" @change="set(key, $event.target.checked)" />
        <span>{{ spec.label }}</span>
      </label>

      <fieldset v-else-if="spec.type === 'visual'" class="pe-visual">
        <legend>
          {{ spec.label }}
          <button v-if="get('visual')" type="button" class="pe-x" title="Quitar visual" @click="deleteField('visual')">✕</button>
        </legend>
        <div v-if="get('visual')" class="pe-grid2">
          <label v-for="(fspec, fkey) in visualSchema" :key="fkey" class="pe-label">
            {{ fspec.label }}
            <select
              v-if="fspec.type === 'select'"
              class="pe-input"
              :value="get('visual')?.[fkey] ?? ''"
              @change="setVisual(fkey, $event.target.value)"
            >
              <option value="">(sin)</option>
              <option v-for="o in fspec.options" :key="o" :value="o">{{ o }}</option>
            </select>
            <input
              v-else
              type="text"
              class="pe-input mono"
              :value="get('visual')?.[fkey] ?? ''"
              @input="setVisual(fkey, $event.target.value)"
            />
          </label>
        </div>
      </fieldset>

      <fieldset v-else-if="spec.type === 'list'" class="pe-list">
        <legend>
          {{ spec.label }}
          <button type="button" class="pe-btn" @click="addItem(key)">+ añadir</button>
        </legend>
        <div v-for="(item, i) in get(key) || []" :key="i" class="pe-item">
          <div class="pe-item-head">
            <strong>#{{ i + 1 }}</strong>
            <button type="button" class="pe-x" @click="removeItem(key, i)">✕</button>
          </div>
          <label v-for="(fspec, fkey) in spec.item || {}" :key="fkey" class="pe-label">
            {{ fspec.label }}
            <textarea
              v-if="fspec.type === 'textarea'"
              rows="2"
              class="pe-input"
              :value="item[fkey] ?? ''"
              @input="item[fkey] = $event.target.value"
            />
            <input
              v-else
              type="text"
              class="pe-input mono"
              :value="item[fkey] ?? ''"
              @input="item[fkey] = $event.target.value"
            />
          </label>
        </div>
      </fieldset>

      <fieldset v-else-if="spec.type === 'textlist'" class="pe-visual">
        <legend>
          {{ spec.label }}
          <button type="button" class="pe-btn" @click="addText(key)">+ añadir</button>
        </legend>
        <div v-for="(val, i) in get(key) || []" :key="i" class="pe-row">
          <input
            type="text"
            class="pe-input mono"
            :value="val"
            @input="setTextAt(key, i, $event.target.value)"
          />
          <button type="button" class="pe-x" @click="removeText(key, i)">✕</button>
        </div>
      </fieldset>
    </div>
  </div>
</template>

<style scoped>
.pe { display: flex; flex-direction: column; gap: 8px; }
.pe-field { display: flex; flex-direction: column; }
.pe-label { display: flex; flex-direction: column; gap: 3px; font-size: 10.5px; font-weight: 700; color: var(--color-ink); }
.pe-req { color: #dc2626; }
.pe-input { border: 1px solid color-mix(in srgb, var(--color-ink) 14%, transparent); background: var(--color-surface); color: var(--color-ink); border-radius: 6px; padding: 4px 6px; font-size: 11px; outline: none; width: 100%; }
.pe-input:focus { border-color: var(--color-brand); box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-brand) 20%, transparent); }
.pe-input.invalid { border-color: #dc2626; }
.pe-input.mono { font-family: ui-monospace, monospace; }
.pe-check { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; cursor: pointer; }
.pe-visual, .pe-list { border: 1px dashed color-mix(in srgb, var(--color-ink) 20%, transparent); border-radius: 8px; padding: 6px 8px 8px; margin: 0; }
.pe-visual legend, .pe-list legend { font-size: 10.5px; font-weight: 800; padding: 0 4px; color: var(--color-ink); display: flex; align-items: center; gap: 8px; }
.pe-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
.pe-item { display: flex; flex-direction: column; gap: 6px; border: 1px solid color-mix(in srgb, var(--color-ink) 8%, transparent); border-radius: 6px; padding: 6px; margin-bottom: 6px; }
.pe-item-head { display: flex; justify-content: space-between; align-items: center; font-size: 10px; }
.pe-row { display: flex; gap: 6px; align-items: center; padding: 4px 0; }
.pe-btn { border: 1px solid color-mix(in srgb, var(--color-ink) 15%, transparent); background: var(--color-surfaceAlt); border-radius: 6px; padding: 2px 8px; font-size: 10px; font-weight: 700; cursor: pointer; color: var(--color-ink); }
.pe-x { border: none; background: transparent; color: var(--color-muted); cursor: pointer; font-size: 11px; padding: 2px 4px; border-radius: 4px; }
.pe-x:hover { color: #dc2626; background: #fee2e2; }
</style>

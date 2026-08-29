#!/usr/bin/env node
/**
 * check-presets.mjs — auditoría de firma de presets
 * Garantiza que cada preset en src/config/presets.js:
 *  1. Declara --preset-mode (token de firma)
 *  2. Declara --font-display y al menos un --radius-*
 *  3. Cubre >= 4 PUNTOS_DE_FIRMA con reglas no triviales
 * Uso: node scripts/check-presets.mjs (incluido en `npm run check`)
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { PRESETS } from "../src/config/presets.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = join(ROOT, "src", "styles", "presets");

const PUNTOS_DE_FIRMA = [
  ".display-title",
  ".eyebrow",
  ".button",
  ".catalog-card",
  ".visual-placeholder",
  ".site-header",
  ".contact-section",
  ".benefits",
  ".floating-contact",
  ".hero-section",
  ".section-muted",
  ".benefit",
];

const MODES = [
  "flat",
  "aero",
  "extruded",
  "stamp",
  "blob",
  "glass",
  "air",
  "papery",
  "mono",
  "grid",
  "editorial",
  "luxury",
  "handmade",
  "solar",
  "ink",
  "organic-dashed",
];

const errors = [];
let ok = 0;

for (const id of PRESETS) {
  const file = join(DIR, `${id}.css`);
  if (!existsSync(file)) {
    errors.push(`${id}: falta ${file}`);
    continue;
  }
  const css = readFileSync(file, "utf8");

  const mode = css.match(/--preset-mode:\s*([a-z-]+)/)?.[1];
  if (!mode) {
    errors.push(`${id}: falta --preset-mode (declaración de firma obligatoria)`);
  } else if (!MODES.includes(mode)) {
    errors.push(`${id}: --preset-mode "${mode}" no está en la lista de modos (${MODES.join(", ")})`);
  }

  if (!css.includes("--font-display")) {
    errors.push(`${id}: falta --font-display`);
  }
  if (!/--radius-(card|button|visual):/.test(css)) {
    errors.push(`${id}: falta al menos un token --radius-*`);
  }

  const covered = PUNTOS_DE_FIRMA.filter((sel) => css.includes(sel.trim()));
  if (covered.length < 4) {
    errors.push(`${id}: firma pobre — cubre ${covered.length}/11 puntos de firma [${covered.join(", ")}]`);
  }

  if (css.trim().length < 60) {
    errors.push(`${id}: archivo vacío o demasiado corto`);
  }

  ok += 1;
}

if (errors.length) {
  console.error(`✗ Auditoría de presets: ${errors.length} problema(s)\n`);
  errors.forEach((e) => console.error(" - " + e));
  process.exit(1);
}
console.log(`✓ Presets OK (${ok} presets con firma y cobertura)`);

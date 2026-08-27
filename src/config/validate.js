/**
 * VALIDACIÓN DE CONFIGURACIÓN
 * Validador puro sin dependencias — usado en build y en runtime dev.
 */
import { PRESETS } from "./presets.js";
import { PALETTES, CUSTOM_COLOR_KEYS, isHexColor } from "./palettes.js";
import { SECTION_IDS, SECTION_VARIANTS } from "./sections.js";

function err(path, message) {
  return `${path}: ${message}`;
}

export function validateConfig(config) {
  const errors = [];

  if (!config || typeof config !== "object") {
    return ["config: debe ser un objeto"];
  }

  // site
  if (!config.site) errors.push(err("site", "requerido"));
  else {
    if (!config.site.brand?.name) errors.push(err("site.brand.name", "requerido"));
    if (!config.site.brand?.shortName) errors.push(err("site.brand.shortName", "requerido"));
    if (config.site.seo?.themeColor && !isHexColor(config.site.seo.themeColor)) {
      errors.push(err("site.seo.themeColor", "debe ser hex #rrggbb"));
    }
    if (config.site.contact?.phone && typeof config.site.contact.phone !== "string") {
      errors.push(err("site.contact.phone", "debe ser string"));
    }
  }

  // theme
  if (!config.theme) errors.push(err("theme", "requerido"));
  else {
    if (!PRESETS.includes(config.theme.preset)) {
      errors.push(err("theme.preset", `debe ser uno de: ${PRESETS.join(", ")}`));
    }
    if (!PALETTES.includes(config.theme.palette)) {
      errors.push(err("theme.palette", `debe ser uno de: ${PALETTES.join(", ")}`));
    }
    if (config.theme.palette === "custom") {
      if (!config.theme.colors) {
        errors.push(err("theme.colors", "requerido cuando palette es custom"));
      } else {
        for (const key of CUSTOM_COLOR_KEYS) {
          if (!isHexColor(config.theme.colors[key])) {
            errors.push(err(`theme.colors.${key}`, "debe ser hex #rrggbb"));
          }
        }
      }
    }
    if (
      config.theme.typography &&
      ![
        "sans-display",
        "display-heavy",
        "elegant",
        "mono",
        "editorial",
        "grotesk",
        "serif-mono",
        "handmade",
        "corporate",
        "organic",
        "bauhaus",
        "pastel",
      ].includes(config.theme.typography)
    ) {
      errors.push(err("theme.typography", "valor no válido"));
    }
    if (config.theme.radius && !["sm", "md", "xl", "2xl", "full"].includes(config.theme.radius)) {
      errors.push(err("theme.radius", "valor no válido"));
    }
  }

  // layout
  if (config.layout) {
    if (config.layout.container && !["sm", "md", "lg", "xl", "7xl"].includes(config.layout.container)) {
      errors.push(err("layout.container", "valor no válido"));
    }
  }

  // navigation
  if (config.navigation && !Array.isArray(config.navigation)) {
    errors.push(err("navigation", "debe ser array"));
  } else if (Array.isArray(config.navigation)) {
    config.navigation.forEach((item, i) => {
      if (!item.label) errors.push(err(`navigation[${i}].label`, "requerido"));
      if (!item.href) errors.push(err(`navigation[${i}].href`, "requerido"));
    });
  }

  // sections
  if (!Array.isArray(config.sections)) {
    errors.push(err("sections", "debe ser array"));
  } else {
    const ids = new Set();
    config.sections.forEach((s, i) => {
      if (!s.id) errors.push(err(`sections[${i}].id`, "requerido"));
      else if (!SECTION_IDS.includes(s.id)) {
        errors.push(err(`sections[${i}].id`, `id desconocido: ${s.id}. Válidos: ${SECTION_IDS.join(", ")}`));
      }
      if (ids.has(s.id)) errors.push(err(`sections[${i}].id`, `duplicado: ${s.id}`));
      ids.add(s.id);
      if (typeof s.enabled !== "boolean") errors.push(err(`sections[${i}].enabled`, "debe ser boolean"));
      if (s.order != null && typeof s.order !== "number") errors.push(err(`sections[${i}].order`, "debe ser number"));
      if (s.variant && SECTION_VARIANTS[s.id] && !SECTION_VARIANTS[s.id].includes(s.variant)) {
        errors.push(err(`sections[${i}].variant`, `para ${s.id} debe ser: ${SECTION_VARIANTS[s.id].join(", ")}`));
      }
      if (s.props != null && typeof s.props !== "object") {
        errors.push(err(`sections[${i}].props`, "debe ser objeto"));
      }
    });
  }

  // order
  if (config.order) {
    if (typeof config.order.enabled !== "boolean") {
      errors.push(err("order.enabled", "debe ser boolean"));
    }
  }

  return errors;
}

export function assertValidConfig(config) {
  const errors = validateConfig(config);
  if (errors.length) {
    const msg = `Configuración inválida:\n - ${errors.join("\n - ")}`;
    throw new Error(msg);
  }
}

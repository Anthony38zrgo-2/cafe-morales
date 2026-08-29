/**
 * REGISTRO DE SECCIONES Y HELPERS
 * Define ids válidos y utilidades para navegación y validación.
 */

export const SECTION_IDS = Object.freeze([
  "header",
  "hero",
  "catalog",
  "partners",
  "loyalty",
  "about",
  "benefits",
  "contact",
  "footer",
  "floating-contact",
]);

export const SECTION_VARIANTS = Object.freeze({
  hero: ["split", "centered", "highlight"],
  catalog: ["grid", "list", "carousel", "masonry"],
  partners: ["grid"],
  loyalty: ["grid", "numbered"],
  about: ["split", "split-reverse", "centered"],
  benefits: ["numbered", "grid", "icons"],
  contact: ["centered", "split"],
});

/**
 * PROPS_SCHEMA — describe props de cada sección para el editor visual del DevSidebar.
 * Tipos: text | textarea | select | check | visual | list | textlist
 * `list.item` define el schema de cada elemento; `visual` agrupa type/name/aspect/alt.
 */
const actionItem = {
  label: { type: "text", label: "Label" },
  href: { type: "text", label: "Href (#catalog…)" },
  variant: { type: "select", label: "Variant", options: ["primary", "secondary", "ghost", "light"] },
};

export const SECTION_PROPS_SCHEMA = Object.freeze({
  header: {},
  hero: {
    eyebrow: { type: "text", label: "Eyebrow" },
    title: { type: "text", label: "Título", required: true },
    description: { type: "textarea", label: "Descripción" },
    actions: { type: "list", label: "Acciones", item: actionItem },
    highlights: { type: "textlist", label: "Highlights" },
    visual: { type: "visual", label: "Visual" },
  },
  catalog: {
    eyebrow: { type: "text", label: "Eyebrow" },
    title: { type: "text", label: "Título", required: true },
    description: { type: "textarea", label: "Descripción" },
    emptyMessage: { type: "text", label: "Mensaje vacío" },
    cardVariant: { type: "select", label: "Card variant", options: ["elevated", "outline"] },
    showFilters: { type: "check", label: "Mostrar filtros" },
    columns: {
      type: "text",
      label: "Columnas (JSON grid)", placeholder: '{"base":1,"md":2,"lg":3}',
    },
  },
  about: {
    eyebrow: { type: "text", label: "Eyebrow" },
    title: { type: "text", label: "Título", required: true },
    description: { type: "textarea", label: "Descripción" },
    visual: { type: "visual", label: "Visual" },
  },
  benefits: {
    eyebrow: { type: "text", label: "Eyebrow" },
    title: { type: "text", label: "Título", required: true },
    description: { type: "textarea", label: "Descripción" },
    items: {
      type: "list",
      label: "Beneficios",
      item: {
        title: { type: "text", label: "Título" },
        description: { type: "textarea", label: "Descripción" },
        icon: { type: "text", label: "Icon (leaf, award…)" },
      },
    },
  },
  partners: {
    eyebrow: { type: "text", label: "Eyebrow" },
    title: { type: "text", label: "Título", required: true },
    description: { type: "textarea", label: "Descripción" },
  },
  loyalty: {
    eyebrow: { type: "text", label: "Eyebrow" },
    title: { type: "text", label: "Título", required: true },
    description: { type: "textarea", label: "Descripción" },
    note: { type: "text", label: "Nota" },
    ctaLabel: { type: "text", label: "Label CTA" },
    ctaMessage: { type: "textarea", label: "Mensaje CTA WhatsApp" },
    items: {
      type: "list",
      label: "Beneficios del club",
      item: {
        icon: { type: "text", label: "Icon (gift, star…)" },
        title: { type: "text", label: "Título" },
        description: { type: "textarea", label: "Descripción" },
      },
    },
  },
  contact: {
    eyebrow: { type: "text", label: "Eyebrow" },
    title: { type: "text", label: "Título", required: true },
    description: { type: "textarea", label: "Descripción" },
    note: { type: "text", label: "Nota" },
    actionLabel: { type: "text", label: "Label botón" },
  },
  footer: {
    legal: { type: "text", label: "Legal" },
    location: { type: "text", label: "Ubicación" },
  },
  "floating-contact": {
    panelTitle: { type: "text", label: "Título panel" },
    panelDescription: { type: "textarea", label: "Descripción panel" },
    questions: {
      type: "list",
      label: "Preguntas",
      item: {
        label: { type: "text", label: "Label" },
        message: { type: "textarea", label: "Mensaje WhatsApp" },
      },
    },
  },
});

const anchorSections = Object.freeze({
  "#top": "hero",
  "#catalog": "catalog",
  "#partners": "partners",
  "#loyalty": "loyalty",
  "#about": "about",
  "#benefits": "benefits",
  "#contact": "contact",
});

export function isSectionEnabled(id, config) {
  const entry = config?.sections?.find((s) => s.id === id);
  return Boolean(entry?.enabled);
}

export function getUnknownSectionIds(config) {
  if (!config?.sections) return [];
  return config.sections.filter((s) => !SECTION_IDS.includes(s.id)).map((s) => s.id);
}

export function getOrderedSections(config) {
  if (!config?.sections) return [];
  return [...config.sections]
    .filter((s) => s.enabled)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function isConfiguredLinkAvailable(href, config) {
  if (!href?.startsWith("#")) return true;
  const sectionId = anchorSections[href];
  return !sectionId || isSectionEnabled(sectionId, config);
}

export function getFirstContentHref(config) {
  const first = ["hero", "catalog", "partners", "loyalty", "about", "benefits", "contact"].find((id) =>
    isSectionEnabled(id, config),
  );
  if (!first) return "#";
  const href = Object.keys(anchorSections).find((k) => anchorSections[k] === first);
  return href ?? "#";
}

export function getNavigationItems(config) {
  if (!config?.navigation?.length) return [];
  return config.navigation.filter((item) => {
    if (!item.section) return true;
    return isSectionEnabled(item.section, config);
  });
}

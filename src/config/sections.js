/**
 * REGISTRO DE SECCIONES Y HELPERS
 * Define ids válidos y utilidades para navegación y validación.
 */

export const SECTION_IDS = Object.freeze([
  "header",
  "hero",
  "catalog",
  "about",
  "benefits",
  "contact",
  "footer",
  "floating-contact",
]);

export const SECTION_VARIANTS = Object.freeze({
  hero: ["split", "centered", "highlight"],
  catalog: ["grid", "list"],
  about: ["split", "split-reverse", "centered"],
  benefits: ["numbered", "grid", "icons"],
  contact: ["centered", "split"],
});

const anchorSections = Object.freeze({
  "#top": "hero",
  "#catalog": "catalog",
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
  const first = ["hero", "catalog", "about", "benefits", "contact"].find((id) =>
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

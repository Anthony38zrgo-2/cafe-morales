/**
 * REGISTRO DE ICONOS SVG — solo Vue + Tailwind + SVG
 * Todos usan currentColor para heredar paleta.
 * Agrega nuevos iconos aquí, no dupliques SVG en componentes.
 */

export const ICONS = Object.freeze({
  leaf: {
    viewBox: "0 0 24 24",
    // hoja estilizada
    path: '<path d="M12 2C8 2 3 6 3 12c0 3.5 2.5 6 6 6 1.5 0 3-.5 4-1.5 1 1 2.5 1.5 4 1.5 3.5 0 6-2.5 6-6 0-6-5-10-9-10-1 0-2 .5-2 1.5 0-1-1-1.5-2-1.5Z"/><path d="M12 3.5V18" />',
  },
  "coffee-bean": {
    viewBox: "0 0 24 24",
    path: '<ellipse cx="9" cy="12" rx="5" ry="8"/><ellipse cx="15" cy="12" rx="5" ry="8"/><path d="M9 8c1.5 1 1.5 7 0 8M15 8c1.5 1 1.5 7 0 8" />',
  },
  truck: {
    viewBox: "0 0 24 24",
    path: '<path d="M1 8h13v7H1z"/><path d="M14 11h4l3 3v1h-7z"/><circle cx="5" cy="18" r="2"/><circle cx="18" cy="18" r="2"/><path d="M7 18h9"/>',
  },
  "shield-check": {
    viewBox: "0 0 24 24",
    path: '<path d="M12 2 4 5v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V5L12 2Z"/><path d="m9 12 2 2 4-4"/>',
  },
  check: {
    viewBox: "0 0 24 24",
    path: '<path d="m5 12 5 5L20 7"/>',
  },
  phone: {
    viewBox: "0 0 24 24",
    path: '<path d="M6 3a2 2 0 0 0-2 2v2a2 2 0 0 0 .5 1.3l2.5 3.5a2 2 0 0 0 1 .7l3 1a2 2 0 0 0 1.5-.2l2.5-1.5a2 2 0 0 0 1-1.7V5a2 2 0 0 0-2-2H6Z"/><path d="M8 21h7a2 2 0 0 0 2-2v-2"/>',
  },
  mail: {
    viewBox: "0 0 24 24",
    path: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7L22 7"/>',
  },
  "arrow-up-right": {
    viewBox: "0 0 24 24",
    path: '<path d="M7 17 17 7"/><path d="M8 7h9v9"/>',
  },
  "shopping-bag": {
    viewBox: "0 0 24 24",
    path: '<path d="M6 7h12l-1 12H7L6 7Z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/>',
  },
  clock: {
    viewBox: "0 0 24 24",
    path: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  },
  star: {
    viewBox: "0 0 24 24",
    path: '<path d="m12 2 3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7l3-7Z"/>',
  },
  heart: {
    viewBox: "0 0 24 24",
    path: '<path d="M12 21s-5-3.5-7.5-6.5S2 9 5 6.5 12 8 12 8s2-2.5 5-1.5S22 11.5 19.5 14.5 12 21 12 21Z"/>',
  },
  whatsapp: {
    viewBox: "0 0 24 24",
    path: '<path d="M19.1 4.9A10 10 0 0 0 2.4 17.3L2 22l4.9-.4A10 10 0 0 0 19.1 4.9ZM12 20a8 8 0 0 1-4.1-1.1l-.3-.2-3-.3.3-3-.2-.3A8 8 0 1 1 12 20Zm6-6c-.3-.2-2-.9-2.3-1-.3-.1-.5-.1-.7.2l-1 1.2c-.2.2-.4.2-.6.1-.3-.1-1-.4-1.9-1.1-.7-.6-1.1-1.4-1.2-1.6-.1-.3 0-.4.1-.6l.5-.6c.1-.1.1-.2.2-.4 0-.1 0-.3 0-.4 0-.1-.7-1.7-1-2.3-.2-.5-.5-.4-.7-.4h-.6c-.2 0-.4 0-.6.3-.2.3-.7.7-.7 1.7s.7 2 1 2.6c.1.2 1.4 2.2 3.5 3 .5.2.8.3 1.1.4.5.2.9.1 1.2.1.4-.1 1.2-.5 1.4-1 .2-.5.2-.9.1-1 0-.1-.2-.1-.5-.2Z"/>',
  },
  close: {
    viewBox: "0 0 24 24",
    path: '<path d="M18 6 6 18"/><path d="M6 6 18 18"/>',
  },
  menu: {
    viewBox: "0 0 24 24",
    path: '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>',
  },
  search: {
    viewBox: "0 0 24 24",
    path: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  },
  map: {
    viewBox: "0 0 24 24",
    path: '<path d="M3 6 9 2l6 4 6-2v14l-6 2-6-4-6 2V6Z"/><path d="M9 2v14"/><path d="M15 6v14"/>',
  },
  award: {
    viewBox: "0 0 24 24",
    path: '<circle cx="12" cy="8" r="6"/><path d="M15.5 12 12 19 8.5 12"/><path d="M8 8a4 4 0 0 0 8 0"/>',
  },
});

export function getIcon(name) {
  return ICONS[name] ?? null;
}

export function hasIcon(name) {
  return Boolean(ICONS[name]);
}

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
    fill: true,
    path: '<path d="m12 2 3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7l3-7Z"/>',
  },
  heart: {
    viewBox: "0 0 24 24",
    fill: true,
    path: '<path d="M12 21s-5-3.5-7.5-6.5S2 9 5 6.5 12 8 12 8s2-2.5 5-1.5S22 11.5 19.5 14.5 12 21 12 21Z"/>',
  },
  whatsapp: {
    viewBox: "0 0 24 24",
    fill: true,
    // WhatsApp — path normalizado, todo dentro de 0 0 24 24, usa currentColor (fill)
    path: '<path d="M19.07 4.93A10 10 0 0 0 2.46 17.38L2 22l4.82-.44A10 10 0 0 0 19.07 4.93ZM12 20a8 8 0 0 1-4.08-1.11l-.29-.17-2.86.27.27-2.79-.19-.29A8 8 0 1 1 12 20Zm5.48-6.01c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.68.15l-.86 1.03c-.18.18-.38.2-.63.07-.24-.13-.96-.35-1.82-1.12-.68-.6-1.13-1.34-1.26-1.56-.13-.23-.02-.35.09-.46l.46-.54c.08-.1.13-.2.19-.33.06-.14.03-.25-.01-.36s-.68-1.63-.93-2.22c-.24-.58-.49-.5-.68-.51h-.58c-.19 0-.41.05-.63.28-.22.24-.84.82-.84 2s.86 2.32 1.03 2.48c.17.15 1.76 2.69 4.26 3.77.59.26 1.05.42 1.41.53.6.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18s.2-1.07.14-1.18c-.06-.11-.22-.16-.52-.31Z"/>',
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

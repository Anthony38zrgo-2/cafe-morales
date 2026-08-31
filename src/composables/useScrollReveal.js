/**
 * useScrollReveal — revelado suave al hacer scroll (IntersectionObserver nativo, sin deps).
 * Directiva `v-reveal` (local en SFCs vía `const vReveal`): añade `.reveal-init`,
 * y `.revealed` al entrar en viewport; luego se retiran las clases para no interferir
 * con las transiciones de hover del elemento.
 * Respeta prefers-reduced-motion (no oculta contenido) y fallback sin IntersectionObserver.
 */

let observer = null;

function getObserver() {
  if (!observer && typeof IntersectionObserver !== "undefined") {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target;
          el.classList.add("revealed");
          observer.unobserve(el);
          const delay = Number(el.style.getPropertyValue("--reveal-delay")) || 0;
          window.setTimeout(() => {
            el.classList.remove("revealed", "reveal-init");
            el.style.removeProperty("--reveal-delay");
          }, delay + 650);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
  }
  return observer;
}

export const vReveal = {
  mounted(el, binding) {
    if (typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return;
    const obs = getObserver();
    if (!obs) return;
    const delay =
      binding?.value && typeof binding.value === "object"
        ? Math.min(Number(binding.value.delay) || 0, 600)
        : 0;
    if (delay > 0) el.style.setProperty("--reveal-delay", `${delay}ms`);
    el.classList.add("reveal-init");
    obs.observe(el);
  },
  unmounted(el) {
    observer?.unobserve(el);
  },
};

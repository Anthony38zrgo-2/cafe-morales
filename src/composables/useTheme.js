/**
 * useTheme — aplica preset y paleta al DOM
 * Soporta paletas curadas (data-palette) y custom (style vars)
 */
import { watchEffect } from "vue";
import { resolvePaletteColors } from "@/config/palettes";
import { loadPalette, loadPreset } from "@/composables/useLazyTheme";

export function useTheme(config) {
  function applyTheme() {
    const theme = config.theme;
    if (!theme) return;

    // Lazy-load solo en dev (prod ya tiene todo en main.css eager)
    if (import.meta.env.DEV) {
      loadPalette(theme.palette);
      loadPreset(theme.preset);
    }

    const html = document.documentElement;
    html.setAttribute("data-preset", theme.preset);
    html.setAttribute("data-palette", theme.palette);

    // Custom: inyectar vars inline
    if (theme.palette === "custom" && theme.colors) {
      const colors = resolvePaletteColors(theme);
      if (colors) {
        html.style.setProperty("--color-ink", colors.ink);
        html.style.setProperty("--color-muted", colors.muted);
        html.style.setProperty("--color-surface", colors.surface);
        html.style.setProperty("--color-surface-alt", colors.surfaceAlt);
        html.style.setProperty("--color-brand", colors.brand);
        html.style.setProperty("--color-brand-dark", colors.brandDark);
        html.style.setProperty("--color-accent", colors.accent);
      }
    } else {
      // limpiar custom vars si venía de custom
      html.style.removeProperty("--color-ink");
      html.style.removeProperty("--color-muted");
      html.style.removeProperty("--color-surface");
      html.style.removeProperty("--color-surface-alt");
      html.style.removeProperty("--color-brand");
      html.style.removeProperty("--color-brand-dark");
      html.style.removeProperty("--color-accent");
    }

    // Radius override (si theme.radius definido, sobreescribe preset)
    const radiusMap = {
      sm: { card: "0.75rem", button: "0.5rem", visual: "0.75rem" },
      md: { card: "1rem", button: "0.75rem", visual: "1rem" },
      xl: { card: "1.5rem", button: "9999px", visual: "2rem" },
      "2xl": { card: "1.75rem", button: "9999px", visual: "2rem" },
      full: { card: "1.5rem", button: "9999px", visual: "1.5rem" },
    };
    if (theme.radius && radiusMap[theme.radius]) {
      const r = radiusMap[theme.radius];
      html.style.setProperty("--radius-card", r.card);
      html.style.setProperty("--radius-button", r.button);
      html.style.setProperty("--radius-visual", r.visual);
    } else if (!theme.radius) {
      html.style.removeProperty("--radius-card");
      html.style.removeProperty("--radius-button");
      html.style.removeProperty("--radius-visual");
    }

    // Typography override — 10 opciones, cubre presets 20. Cada define 5 tokens (sans/display/serif/mono/accent)
    const typographyMap = {
      "sans-display": {
        sans: "Inter, ui-sans-serif, system-ui, sans-serif",
        display: "Fraunces, Georgia, 'Times New Roman', serif",
        serif: "Fraunces, Georgia, serif",
        mono: "'JetBrains Mono', ui-monospace, monospace",
        accent: "Sora, ui-sans-serif, sans-serif",
      },
      "display-heavy": {
        sans: "'Manrope', Inter, ui-sans-serif, system-ui, sans-serif",
        display: "'Barlow Condensed', Impact, sans-serif",
        serif: "Fraunces, Georgia, serif",
        mono: "'JetBrains Mono', ui-monospace, monospace",
        accent: "Sora, sans-serif",
      },
      elegant: {
        sans: "'DM Sans', Inter, ui-sans-serif, sans-serif",
        display: "'Cormorant Garamond', Georgia, serif",
        serif: "'Cormorant Garamond', Georgia, serif",
        mono: "'JetBrains Mono', monospace",
        accent: "Fraunces, serif",
      },
      mono: {
        sans: "'JetBrains Mono', ui-monospace, monospace",
        display: "'JetBrains Mono', ui-monospace, monospace",
        serif: "'JetBrains Mono', monospace",
        mono: "'JetBrains Mono', monospace",
        accent: "'JetBrains Mono', monospace",
      },
      editorial: {
        sans: "'DM Sans', Inter, sans-serif",
        display: "Fraunces, Georgia, serif",
        serif: "Fraunces, Georgia, serif",
        mono: "'JetBrains Mono', monospace",
        accent: "'Instrument Serif', Georgia, serif",
      },
      grotesk: {
        sans: "'Space Grotesk', Inter, sans-serif",
        display: "'Space Grotesk', Inter, sans-serif",
        serif: "'Cormorant Garamond', serif",
        mono: "'JetBrains Mono', monospace",
        accent: "Sora, sans-serif",
      },
      "serif-mono": {
        sans: "'Cormorant Garamond', Georgia, serif",
        display: "'JetBrains Mono', monospace",
        serif: "'Cormorant Garamond', serif",
        mono: "'JetBrains Mono', monospace",
        accent: "Inter, sans-serif",
      },
      handmade: {
        sans: "'Plus Jakarta Sans', Inter, sans-serif",
        display: "'Instrument Serif', Georgia, serif",
        serif: "'Instrument Serif', serif",
        mono: "'JetBrains Mono', monospace",
        accent: "Fraunces, serif",
      },
      corporate: {
        sans: "Inter, ui-sans-serif, system-ui, sans-serif",
        display: "Sora, Inter, sans-serif",
        serif: "Fraunces, serif",
        mono: "'JetBrains Mono', monospace",
        accent: "Outfit, sans-serif",
      },
      organic: {
        sans: "'Plus Jakarta Sans', Inter, sans-serif",
        display: "Fraunces, Georgia, serif",
        serif: "Fraunces, serif",
        mono: "'JetBrains Mono', monospace",
        accent: "'DM Sans', sans-serif",
      },
      bauhaus: {
        sans: "'Poppins', 'Space Grotesk', Inter, sans-serif",
        display: "'Poppins', 'Space Grotesk', Inter, sans-serif",
        serif: "'Space Grotesk', sans-serif",
        mono: "'JetBrains Mono', monospace",
        accent: "'Poppins', sans-serif",
      },
      pastel: {
        sans: "'Poppins', Inter, sans-serif",
        display: "Fraunces, Georgia, serif",
        serif: "Fraunces, serif",
        mono: "'JetBrains Mono', monospace",
        accent: "Sora, sans-serif",
      },
    };
    if (theme.typography && typographyMap[theme.typography]) {
      const t = typographyMap[theme.typography];
      html.style.setProperty("--font-sans", t.sans);
      html.style.setProperty("--font-display", t.display);
      html.style.setProperty("--font-serif", t.serif);
      html.style.setProperty("--font-mono", t.mono);
      html.style.setProperty("--font-accent", t.accent);
    } else {
      // Vacío/indefinido o inválido → deja ver fuente del preset ([data-preset])
      html.style.removeProperty("--font-sans");
      html.style.removeProperty("--font-display");
      html.style.removeProperty("--font-serif");
      html.style.removeProperty("--font-mono");
      html.style.removeProperty("--font-accent");
    }

    // SEO theme-color
    if (config.site?.seo?.themeColor) {
      let meta = document.querySelector('meta[name="theme-color"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "theme-color";
        document.head.appendChild(meta);
      }
      const resolved = theme.palette === "custom" ? theme.colors?.brand : null;
      meta.content = resolved || config.site.seo.themeColor;
    }

    if (config.site?.seo?.title) {
      document.title = config.site.seo.title;
    }
    if (config.site?.seo?.description) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.content = config.site.seo.description;
    }
  }

  // Aplicar inmediatamente y reaccionar si config es reactivo
  if (typeof watchEffect !== "undefined") {
    watchEffect(applyTheme);
  } else {
    applyTheme();
  }

  return { applyTheme };
}

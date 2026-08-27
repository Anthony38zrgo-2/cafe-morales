import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import App from "@/App.vue";
import { siteConfig } from "@/config/site.config";
import { validateConfig } from "@/config/validate";
import { PALETTES } from "@/config/palettes";
import { PRESETS } from "@/config/presets";
import { getOrderedSections, isSectionEnabled } from "@/config/sections";
import catalog from "@/data/catalog.json";

describe("config", () => {
  it("valida sin errores", () => {
    expect(validateConfig(siteConfig)).toEqual([]);
  });

  it("expone 22 presets", () => {
    expect(PRESETS).toEqual([
      "cafetal",
      "minimal",
      "vibrante",
      "editorial",
      "organic",
      "brutalist",
      "glass",
      "luxury",
      "retro",
      "corporate",
      "handmade",
      "mono-accent",
      "clay",
      "air",
      "paper",
      "midnight-glass",
      "solar",
      "ink",
      "editorial-soft",
      "neo-brutal",
      "bauhaus",
      "bauhaus-pastel",
    ]);
  });

  it("expone paletas curadas + custom", () => {
    expect(PALETTES).toContain("forest");
    expect(PALETTES).toContain("sage");
    expect(PALETTES).toContain("indigo");
    expect(PALETTES).toContain("forest-dark");
    expect(PALETTES).toContain("indigo-dark");
    expect(PALETTES).toContain("sage-pastel");
    expect(PALETTES).toContain("strawberry-pastel");
    expect(PALETTES).toContain("custom");
    expect(PALETTES.length).toBe(76); // 75 curadas (30 light +30 dark +15 pastel) + custom
  });

  it("ordena secciones por order", () => {
    const ordered = getOrderedSections(siteConfig);
    for (let i = 1; i < ordered.length; i++) {
      expect(ordered[i].order).toBeGreaterThanOrEqual(ordered[i - 1].order);
    }
  });

  it("catalog tiene visual data-driven", () => {
    expect(catalog.length).toBeGreaterThan(0);
    for (const item of catalog) {
      expect(item.id).toBeTruthy();
      expect(item.name).toBeTruthy();
      expect(item.visual).toBeDefined();
      expect(["svg", "image"]).toContain(item.visual.type);
    }
  });
});

describe("App", () => {
  it("renderiza sin errores", () => {
    const wrapper = mount(App);
    expect(wrapper.exists()).toBe(true);
  });

  it("solo muestra secciones habilitadas", () => {
    const wrapper = mount(App);
    const html = wrapper.html();
    // hero y catalog deben estar
    if (isSectionEnabled("hero", siteConfig)) expect(html).toContain('id="top"');
    if (isSectionEnabled("catalog", siteConfig)) expect(html).toContain('id="catalog"');
  });

  it("usa data-preset y data-palette", async () => {
    mount(App);
    // useTheme aplica atributos en html
    expect(document.documentElement.getAttribute("data-preset")).toBe(siteConfig.theme.preset);
    expect(document.documentElement.getAttribute("data-palette")).toBe(siteConfig.theme.palette);
  });
});

describe("validación custom palette", () => {
  it("rechaza hex inválido", () => {
    const bad = JSON.parse(JSON.stringify(siteConfig));
    bad.theme.palette = "custom";
    bad.theme.colors = {
      ink: "no-hex",
      muted: "#fff",
      surface: "#fff",
      surfaceAlt: "#fff",
      brand: "#fff",
      brandDark: "#fff",
      accent: "#fff",
    };
    const errors = validateConfig(bad);
    expect(errors.some((e) => e.includes("theme.colors.ink"))).toBe(true);
  });
});

<script setup>
/**
 * SvgIllustration — ilustración decorativa SVG para placeholders
 * Variantes data-driven, todas en currentColor + brand/accent.
 */
defineProps({
  name: { type: String, required: true },
  alt: { type: String, default: "" },
});

const illustrations = {
  "hero-coffee": {
    viewBox: "0 0 400 300",
    content: `
      <rect x="40" y="40" width="320" height="220" rx="24" fill="currentColor" opacity="0.07" stroke="currentColor" stroke-width="2" stroke-dasharray="10 8"/>
      <g opacity="0.15" fill="currentColor"><circle cx="120" cy="100" r="48"/><circle cx="280" cy="180" r="64"/><circle cx="200" cy="140" r="32"/></g>
      <g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <path d="M140 180c0-24 16-44 40-44s40 20 40 44-16 44-40 44-40-20-40-44Z" opacity="0.9"/>
        <path d="M180 150c8 6 8 44 0 52M220 150c8 6 8 44 0 52" opacity="0.35"/>
        <path d="M210 110c6-14 18-22 32-18M190 100c-4-10-12-16-22-14" opacity="0.45"/>
      </g>
      <text x="200" y="250" text-anchor="middle" font-size="11" font-weight="700" letter-spacing="2.5" fill="currentColor" opacity="0.5">HERO · 4:3</text>
    `,
  },
  "hero-minimal": {
    viewBox: "0 0 400 300",
    content: `
      <rect x="40" y="40" width="320" height="220" rx="16" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.18"/>
      <rect x="56" y="56" width="288" height="188" rx="10" fill="currentColor" opacity="0.04"/>
      <g stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.3">
        <line x1="60" y1="100" x2="340" y2="100"/><line x1="60" y1="140" x2="340" y2="140"/><line x1="60" y1="180" x2="340" y2="180"/><line x1="60" y1="220" x2="340" y2="220"/>
        <line x1="100" y1="60" x2="100" y2="240"/><line x1="160" y1="60" x2="160" y2="240"/><line x1="220" y1="60" x2="220" y2="240"/><line x1="280" y1="60" x2="280" y2="240"/>
      </g>
      <circle cx="200" cy="150" r="36" fill="currentColor" opacity="0.08" stroke="currentColor" stroke-width="1.5"/>
      <text x="200" y="250" text-anchor="middle" font-size="11" font-weight="700" letter-spacing="2.5" fill="currentColor" opacity="0.5">MINIMAL · 4:3</text>
    `,
  },
  "hero-vibrante": {
    viewBox: "0 0 400 300",
    content: `
      <rect x="40" y="40" width="320" height="220" rx="20" fill="currentColor" opacity="0.08" stroke="currentColor" stroke-width="2.5"/>
      <g fill="currentColor" opacity="0.12"><rect x="80" y="80" width="100" height="100" rx="14" transform="rotate(8 130 130)"/><rect x="220" y="100" width="80" height="80" rx="12" transform="rotate(-6 260 140)"/></g>
      <g fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M140 150l20 20 40-40"/><circle cx="200" cy="150" r="52" opacity="0.25"/></g>
      <text x="200" y="250" text-anchor="middle" font-size="11" font-weight="800" letter-spacing="2.5" fill="currentColor" opacity="0.55">VIBRANTE · 4:3</text>
    `,
  },
  "about-finca": {
    viewBox: "0 0 400 500",
    content: `
      <rect x="30" y="30" width="340" height="440" rx="28" fill="currentColor" opacity="0.06" stroke="currentColor" stroke-width="2" stroke-dasharray="12 8"/>
      <path d="M80 360 Q200 120 320 360" fill="none" stroke="currentColor" stroke-width="2.2" opacity="0.2"/>
      <g fill="currentColor" opacity="0.14"><circle cx="140" cy="160" r="28"/><circle cx="260" cy="190" r="36"/><circle cx="200" cy="250" r="20"/></g>
      <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M160 300c0-18 12-32 28-32s28 14 28 32-12 32-28 32-28-14-28-32Z"/>
        <path d="M188 275c6 4 6 34 0 40M212 275c6 4 6 34 0 40" opacity="0.4"/>
      </g>
      <text x="200" y="430" text-anchor="middle" font-size="11" font-weight="700" letter-spacing="2.5" fill="currentColor" opacity="0.45">FINCA · 4:5</text>
    `,
  },
  "about-generic": {
    viewBox: "0 0 400 500",
    content: `
      <rect x="30" y="30" width="340" height="440" rx="28" fill="none" stroke="currentColor" stroke-width="1.6" opacity="0.18"/>
      <circle cx="200" cy="200" r="64" fill="currentColor" opacity="0.06" stroke="currentColor" stroke-width="1.6"/>
      <g stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"><path d="M170 200l20 20 40-40"/><circle cx="200" cy="200" r="48" opacity="0.25"/></g>
      <text x="200" y="430" text-anchor="middle" font-size="11" font-weight="700" letter-spacing="2.5" fill="currentColor" opacity="0.45">ABOUT · 4:5</text>
    `,
  },
  "catalog-empty": {
    viewBox: "0 0 400 300",
    content: `
      <rect x="40" y="40" width="320" height="220" rx="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-dasharray="10 8" opacity="0.25"/>
      <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="150" y="110" width="100" height="70" rx="10"/><path d="M150 135h100M180 110v70M210 110v70"/></g>
      <text x="200" y="210" text-anchor="middle" font-size="11" font-weight="700" letter-spacing="2" fill="currentColor" opacity="0.4">CATÁLOGO VACÍO</text>
    `,
  },
  generic: {
    viewBox: "0 0 400 300",
    content: `
      <rect x="40" y="40" width="320" height="220" rx="20" fill="currentColor" opacity="0.06" stroke="currentColor" stroke-width="1.8" stroke-dasharray="10 8"/>
      <circle cx="200" cy="150" r="44" fill="none" stroke="currentColor" stroke-width="1.8" opacity="0.25"/>
      <g stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M185 150l12 12 24-24"/></g>
    `,
  },
};
</script>

<template>
  <div class="svg-illustration grid place-items-center p-6" role="img" :aria-label="alt || name">
    <!-- eslint-disable-next-line vue/no-v-html -->
    <svg
      :viewBox="(illustrations[name] || illustrations.generic).viewBox"
      class="h-full w-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      v-html="(illustrations[name] || illustrations.generic).content"
    />
  </div>
</template>

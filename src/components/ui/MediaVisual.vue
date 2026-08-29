<script setup>
/**
 * MediaVisual — visual unificado para WebP e ilustraciones SVG
 * Props data-driven: visual { type: "image" | "svg", src?, name?, aspect?, alt? }
 * Si type image y src no resuelve, cae a ilustración.
 */
import { computed } from "vue";
import SvgIllustration from "@/components/ui/SvgIllustration.vue";

const props = defineProps({
  visual: { type: Object, default: null },
  aspect: { type: String, default: "" },
  label: { type: String, default: "" },
  imageSrc: { type: String, default: "" },
});

const resolvedType = computed(() => {
  if (props.visual?.type) return props.visual.type;
  if (props.imageSrc) return "image";
  return "svg";
});

const resolvedAspect = computed(() => {
  if (props.visual?.aspect) return props.visual.aspect;
  if (props.aspect) return props.aspect;
  return "4 / 3";
});

const resolvedAlt = computed(() => props.visual?.alt || props.label || "Visual");
const resolvedSvgName = computed(() => props.visual?.name || "generic");
const resolvedSrc = computed(() => props.imageSrc || props.visual?.src || "");
const hasImage = computed(() => resolvedType.value === "image" && Boolean(resolvedSrc.value));
</script>

<template>
  <div
    class="media-visual"
    :style="{ aspectRatio: resolvedAspect }"
    role="img"
    :aria-label="resolvedAlt"
  >
    <img
      v-if="hasImage"
      :src="resolvedSrc"
      :alt="resolvedAlt"
      loading="lazy"
      decoding="async"
      class="h-full w-full object-cover"
    >
    <SvgIllustration
      v-else
      :name="resolvedSvgName"
      :alt="resolvedAlt"
      class="h-full w-full text-brand"
    />
  </div>
</template>

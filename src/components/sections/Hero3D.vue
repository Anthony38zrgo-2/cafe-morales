<script setup>
/**
 * Hero3D — visual de héroe con modelo 3D (three.js, carga dinámica en chunk aparte)
 * Si el GLB no existe o three falla → cae al poster SVG con aviso "Modelo 3D próximamente".
 * Interacción: auto-rotación lenta (desactivada con prefers-reduced-motion) +
 * drag (rotar Y) + wheel zoom (clamp) + touch drag, con resize observer y cleanup.
 */
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import SvgIllustration from "@/components/ui/SvgIllustration.vue";

const props = defineProps({
  visual: { type: Object, default: null },
  label: { type: String, default: "" },
});

const container = ref(null);
const status = ref("loading"); // loading | ready | fallback

const aspect = computed(() => props.visual?.aspect || "4 / 3");
const alt = computed(() => props.visual?.alt || props.label || "Modelo 3D");
const poster = computed(() => props.visual?.poster || "hero-coffee");

const smooth = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;

// Globs de modelos: si el archivo no existe, no rompe el build y caemos a fallback.
const MODEL_GLOBS = import.meta.glob("/src/assets/models/*.glb", { query: "?url", import: "default" });

let renderer = null;
let scene = null;
let camera = null;
let modelGroup = null;
let frameId = 0;
let disposed = false;
let resizeObserver = null;
let dragActive = false;
let lastX = 0;
let autoRotation = 0;
let rotationY = 0;
let cameraZ = 14;

function resolveModelUrl(src) {
  const factory = MODEL_GLOBS[`/src/assets/models/${src}.glb`];
  if (factory) return factory();
  // Si el src exacto no está, usa el primer modelo disponible del glob (src es un identificador,
  // no un nombre fijo); si no hay ningún GLB, null → fallback al poster.
  const first = Object.values(MODEL_GLOBS)[0];
  return first ? first() : null;
}

function teardown(asFallback = false) {
  if (!asFallback) disposed = true;
  if (frameId) cancelAnimationFrame(frameId);
  frameId = 0;
  resizeObserver?.disconnect();
  resizeObserver = null;
  if (renderer) {
    renderer.dispose();
    renderer.domElement?.remove();
    renderer = null;
  }
  scene = null;
  camera = null;
  modelGroup = null;
}

function animate(THREE) {
  if (disposed) return;
  frameId = requestAnimationFrame(() => animate(THREE));
  if (modelGroup) {
    if (!smooth) autoRotation += 0.003;
    modelGroup.rotation.y = rotationY + autoRotation;
    modelGroup.position.y = Math.sin(Date.now() * 0.002) * 0.08;
  }
  renderer?.render(scene, camera);
}

function onPointerDown(e) {
  dragActive = true;
  lastX = e.clientX;
  renderer?.domElement.setPointerCapture?.(e.pointerId);
}
function onPointerMove(e) {
  if (!dragActive) return;
  rotationY += (e.clientX - lastX) * 0.005;
  lastX = e.clientX;
}
function onPointerUp() {
  dragActive = false;
}
function onWheel(e) {
  e.preventDefault();
  cameraZ = Math.min(24, Math.max(6, cameraZ + e.deltaY * 0.01));
  if (camera) camera.position.z = cameraZ;
}
function onResize() {
  const el = container.value;
  if (!el || !renderer || !camera) return;
  const width = el.clientWidth || 640;
  const height = el.clientHeight || 480;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

async function init() {
  const el = container.value;
  if (!el || disposed) return;
  try {
    const THREE = await import("three");
    const { GLTFLoader } = await import("three/addons/loaders/GLTFLoader.js");
    const url = await resolveModelUrl(props.visual?.src);
    if (disposed) return;
    if (!url) throw new Error("Modelo no encontrado");

    const width = el.clientWidth || 640;
    const height = el.clientHeight || 480;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.style.touchAction = "none";
    el.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    // Ángulo más elevado para ver el contenido de la taza
    camera.position.set(0, 4.4, cameraZ);
    camera.lookAt(0, 0.1, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const accentColor =
      getComputedStyle(document.documentElement).getPropertyValue("--color-accent").trim() || "#f59e0b";
    const directional = new THREE.DirectionalLight(accentColor, 2.2);
    directional.position.set(5, 8, 6);
    scene.add(directional);

    modelGroup = new THREE.Group();
    scene.add(modelGroup);

    await new Promise((resolve, reject) => {
      new GLTFLoader().load(
        url,
        (gltf) => {
          modelGroup.add(gltf.scene);
          const box = new THREE.Box3().setFromObject(gltf.scene);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          gltf.scene.position.sub(center);
          const maxDim = Math.max(size.x, size.y, size.z) || 1;
          modelGroup.scale.setScalar((2 * Math.tan((camera.fov * Math.PI) / 360) * cameraZ * 0.6) / maxDim);
          resolve();
        },
        undefined,
        (err) => reject(err),
      );
    });
    if (disposed) return;

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });

    resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(el);

    status.value = "ready";
    animate(THREE);
  } catch (e) {
    void e;
    if (disposed) return;
    teardown(true);
    status.value = "fallback";
  }
}

onMounted(() => {
  if (!props.visual?.src) {
    status.value = "fallback";
    return;
  }
  init();
});
onBeforeUnmount(() => {
  teardown();
});
</script>

<template>
  <div
    ref="container"
    class="hero-model-wrap media-visual"
    :style="{ aspectRatio: aspect }"
    role="img"
    :aria-label="alt"
  >
    <template v-if="status !== 'ready'">
      <SvgIllustration :name="poster" :alt="alt" class="h-full w-full text-brand" />
      <small v-if="status === 'fallback'" class="hero-model-fallback">Modelo 3D próximamente</small>
    </template>
  </div>
</template>

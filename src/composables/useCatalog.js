import { computed, ref } from "vue";

export function useCatalog(items) {
  const activeCategory = ref("Todos");

  const categories = computed(() => {
    const cats = items.map((i) => i.category).filter(Boolean);
    return ["Todos", ...new Set(cats)];
  });

  const filtered = computed(() => {
    if (activeCategory.value === "Todos") return items;
    return items.filter((i) => i.category === activeCategory.value);
  });

  function setCategory(cat) {
    activeCategory.value = cat;
  }

  return { activeCategory, categories, filtered, setCategory };
}

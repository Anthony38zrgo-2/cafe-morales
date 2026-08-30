import { reactive } from "vue";

/**
 * CENTRO DE CONFIGURACIÓN — MORALES COFFEE MARKET
 * Coffee market peruano: partners con trayectoria (hoy: Valqui de Café Ventura S.A.C.),
 * precio justo, información clara de origen y perfil.
 * Default del proyecto: preset `clay` + paleta `amber` (combo curado más funcional para café).
 * En DEV es reactive para que DevSidebar (localStorage) haga live preview.
 */
const rawConfig = {
  site: {
    brand: {
      name: "Morales Coffee Market",
      shortName: "MCM",
      tagline: "Café calidad-precio para cada gusto",
      description:
        "Coffee market peruano. Traemos cafés de productores y tostadores con trayectoria (hoy: Valqui de Café Ventura S.A.C.) a precios justos, con información clara de origen y perfil.",
    },
    seo: {
      title: "Morales Coffee Market | Café calidad-precio para cada gusto",
      description:
        "Café peruano por mayor y al detalle: Valqui Clásico 250g/500g/1kg. Regalos a partir de S/ 25 y beneficios para compradores recurrentes. Envíos a todo el Perú.",
      themeColor: "#d97706",
    },
    contact: {
      phone: "51987755593",
      phoneDisplay: "987 755 593",
      email: "",
      address: "Almacén en Lima · Envíos a todo el Perú",
      whatsappDefaultMessage: "Hola, quisiera hacer un pedido de Morales Coffee Market.",
    },
  },

  theme: {
    preset: "clay",
    palette: "amber",
    typography: "elegant",
    radius: "xl",
  },

  layout: {
    container: "7xl",
    sectionSpacing: "default",
  },

  navigation: [
    { label: "Catálogo", href: "#catalog", section: "catalog" },
    { label: "Partners", href: "#partners", section: "partners" },
    { label: "Club Amigos", href: "#loyalty", section: "loyalty" },
    { label: "Nosotros", href: "#about", section: "about" },
    { label: "Contacto", href: "#contact", section: "contact" },
  ],

  gift: {
    enabled: true,
    threshold: 25,
    items: [
      { id: "pulsera", label: "Pulsera de café" },
      { id: "collar", label: "Collar de café" },
      { id: "sticker", label: "Sticker de café" },
    ],
  },

  sections: [
    {
      id: "header",
      enabled: true,
      order: 0,
      variant: "default",
      props: {},
    },
    {
      id: "hero",
      enabled: true,
      order: 10,
      variant: "split",
      props: {
        eyebrow: "Morales Coffee Market · Perú",
        title: "Café calidad-precio para cada gusto",
        description:
          "Traemos a tu hogar el café de tostadores peruanos con trayectoria —hoy Valqui Clásico— a precio justo y con la información que necesitas para elegir bien.",
        actions: [
          { label: "Ver catálogo", href: "#catalog", variant: "primary" },
          { label: "Pedir por WhatsApp", href: "#contact", variant: "secondary" },
        ],
        visual: {
          type: "model",
          src: "taza-cafe",
          poster: "hero-coffee",
          aspect: "4 / 3",
          alt: "Taza de café 3D",
        },
        highlights: ["+ S/ 25 = regalo accesorio", "Regiones: Jaén · Chanchamayo · Cusco", "Envíos a todo el Perú"],
        decoration: { src: "beans-floating", placement: "floating", motion: true },
      },
    },
    {
      id: "catalog",
      enabled: true,
      order: 20,
      variant: "grid",
      props: {
        eyebrow: "El catálogo del momento",
        title: "Un mercado para cada bolsillo",
        description:
          "Cafés cuidadosamente seleccionados de tostadores peruanos con trayectoria. Elige tu gama y presentación, con información clara de origen.",
        emptyMessage: "Pronto nuevos cafés.",
        columns: { base: 1, md: 2, lg: 3 },
        cardVariant: "elevated",
        showFilters: true,
      },
    },
    {
      id: "partners",
      enabled: true,
      order: 30,
      variant: "grid",
      props: {
        eyebrow: "Nuestros partners",
        title: "Trazabilidad y confianza",
        description:
          "Trabajamos con proveedores con trayectoria. Hoy: Valqui, de Café Ventura S.A.C. Cada partner suma más orígenes, variedades y precios al market.",
      },
    },
    {
      id: "loyalty",
      enabled: true,
      order: 40,
      variant: "grid",
      props: {
        eyebrow: "Programa Amigos del Café",
        title: "Fieles a tu taza, fieles a ti",
        description:
          "Queremos que ahorrar café también sea para recurrentes: aquí están nuestros beneficios, incluyendo cafés premium y una esencia del día.",
        items: [
          {
            icon: "gift",
            title: "Regalo por pedido + S/ 25",
            description:
              "Por cada pedido mayor a S/ 25 te acompaña un accesorio: pulseras, collares o stickers de café.",
          },
          {
            icon: "star",
            title: "Café premium para recurrentes",
            description:
              "Los compradores recurrentes reciben cafés especiales: geisha, bourbon y typica.",
          },
          {
            icon: "award",
            title: "Esencia del día, preparada fresca",
            description:
              "Te enviamos una muestra de esencia de café de nuestra gama premium, preparada el mismo día del envío.",
          },
        ],
        note: "El canje se coordina por WhatsApp: cuéntanos tu nombre y detalles, te reconocemos como amigo del café.",
        ctaLabel: "Soy comprador recurrente",
        ctaMessage:
          "Hola, soy cliente recurrente de Morales Coffee Market y quisiera conocer mis beneficios especiales.",
      },
    },
    {
      id: "about",
      enabled: true,
      order: 50,
      variant: "split-reverse",
      props: {
        eyebrow: "El market",
        title: "De proveedores confiables a tu taza",
        description:
          "Somos un coffee market: seleccionamos café de tostadores y productores peruanos con trayectoria, ofrecemos precios justos y damos información de origen para que elijas según tu gusto y bolsillo.",
        visual: {
          type: "image",
          src: "valqui-vendedora",
          aspect: "4 / 5",
          alt: "Nuestro market de café",
        },
      },
    },
    {
      id: "benefits",
      enabled: false,
      order: 60,
      variant: "numbered",
      props: {
        eyebrow: "Por qué el market",
        title: "Información clara, precio justo, tu gusto",
        description:
          "Al comprar en un market sabes de quién viene tu café, cuánto cuesta y qué esperar en la taza.",
        items: [
          {
            title: "Selección con trayectoria",
            description:
              "Cada partner que sumamos tiene años produciendo y tostando café peruano: calidad comprobada.",
            icon: "shield-check",
          },
          {
            title: "Calidad-precio",
            description:
              "Precios de mercado justos, pensados para ti: desde S/ 6.50 una bolsa de 250 g.",
            icon: "hand-coins",
          },
          {
            title: "Origen e info clara",
            description:
              "Región, perfil y presentación de cada café visible en su ficha. Así eliges con confianza.",
            icon: "map-pin",
          },
        ],
      },
    },
    {
      id: "contact",
      enabled: true,
      order: 70,
      variant: "centered",
      props: {
        eyebrow: "Haz tu pedido",
        title: "Pide por WhatsApp, envío a todo el Perú",
        description:
          "Escríbenos y coordinamos pago, envío y tu regalo (pedidos + S/ 25).",
        note: "Almacén en Lima · Envíos a todo el Perú",
        actionLabel: "Escribir por WhatsApp",
      },
    },
    {
      id: "footer",
      enabled: true,
      order: 90,
      variant: "default",
      props: {
        legal: "Todos los derechos reservados.",
        location: "Lima · Envíos a todo el Perú",
      },
    },
    {
      id: "floating-contact",
      enabled: true,
      order: 100,
      variant: "panel",
      props: {
        panelTitle: "¿Cómo podemos ayudarte?",
        panelDescription: "Elige una opción para recibir atención rápida y continuar por WhatsApp.",
        questions: [
          {
            label: "Quiero hacer un pedido",
            message: "Hola, quisiera hacer un pedido en Morales Coffee Market.",
          },
          {
            label: "Preguntar por el regalo +S/ 25",
            message: "Hola, quisiera saber más del regalo por pedidos mayores a S/ 25.",
          },
          {
            label: "Consultar envíos",
            message: "Hola, quisiera consultar el costo y tiempo de envío.",
          },
        ],
      },
    },
  ],

  order: {
    enabled: true,
  },
};

/**
 * Guard para Node (scripts/*.mjs): import.meta.env es Vite-only.
 */
const IS_DEV = typeof import.meta !== "undefined" && import.meta.env?.DEV === true;

export const siteConfig = IS_DEV ? reactive(rawConfig) : rawConfig;

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
        "Café peruano por mayor y al detalle: Valqui Clásico 250g/500g/1kg. Con cualquier compra recibe una botellita de 300 ml de esencia premium de café de especialidad. Envíos a todo el Perú.",
      themeColor: "#d97706",
    },
    contact: {
      phone: "51964163543",
      phoneDisplay: "964 163 543",
      email: "",
      address: "Almacén en Lima · Envíos a todo el Perú",
      whatsappDefaultMessage:
        "Hola, quisiera hacer un pedido de Morales Coffee Market.",
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
    {
      label: "Origen y selección",
      href: "#partners",
      section: "partners",
    },
    { label: "Club Amigos", href: "#loyalty", section: "loyalty" },
    { label: "Nosotros", href: "#about", section: "about" },
    { label: "Contacto", href: "#contact", section: "contact" },
  ],

  gift: {
    enabled: false,
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
          {
            label: "Pedir por WhatsApp",
            href: "#contact",
            variant: "secondary",
          },
        ],
        visual: {
          type: "image",
          src: "dalia-moka-pot",
          aspect: "1 / 1",
          alt: "Dalia presenta una Moka Pot celeste",
        },
        highlights: [
          "Con cualquier compra: esencia premium de café de especialidad (300 ml)",
          "Regiones: Jaén · Chanchamayo · Cusco",
          "Envíos a todo el Perú",
        ],
        decoration: {
          src: "beans-floating",
          placement: "floating",
          motion: true,
        },
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
        background: "hero-echo",
      },
    },
    {
      id: "ritual",
      enabled: true,
      order: 25,
      variant: "centered",
      props: {
        eyebrow: "El ritual del café",
        title: "Del origen a tu taza",
        description:
          "Elegimos cafés peruanos con historia para que cada preparación termine en una taza que disfrutas de verdad.",
        background: "beans-light",
        visual: {
          type: "model",
          src: "taza-cafe",
          poster: "hero-coffee",
          aspect: "1 / 1",
          alt: "Taza de café en 3D",
        },
      },
    },
    {
      id: "partners",
      enabled: true,
      order: 30,
      variant: "grid",
      props: {
        eyebrow: "Origen y selección",
        title: "Conocemos quién produce. Elegimos lo que vale la pena.",
        description:
          "Trabajamos con productores y tostadores peruanos con trayectoria. Conocemos su historia, revisamos el origen y comparamos calidad, perfil y precio para ofrecerte cafés confiables y fáciles de elegir.",
        visual: {
          type: "image",
          src: "valqui-vendedora",
          aspect: "4 / 5",
          alt: "Productora de Café Ventura presenta una bolsa de café Valqui",
        },
        criteriaTitle: "Nuestra forma de elegir",
        criteriaDescription:
          "Buscamos cafés peruanos con buena relación calidad-precio, información clara y una trayectoria que podamos comprobar.",
        criteria: [
          {
            title: "Trayectoria comprobada",
            description: "Productores y tostadores con experiencia y trabajo verificable.",
          },
          {
            title: "Origen claro",
            description: "Regiones, presentación y perfil visibles para elegir con confianza.",
          },
          {
            title: "Precio justo",
            description: "Alternativas confiables para distintos gustos y presupuestos.",
          },
        ],
      },
    },
    {
      id: "loyalty",
      enabled: false,
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
      enabled: false,
      order: 50,
      variant: "split-reverse",
      props: {
        eyebrow: "Nuestra forma de elegir",
        title: "Hacemos más fácil elegir bien",
        description:
          "Reunimos cafés peruanos confiables, comparamos opciones y te ofrecemos información clara para que encuentres el café adecuado para tu gusto y presupuesto.",
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
          "Escríbenos y coordinamos pago y envío. Con cualquier compra recibes una botellita de 300 ml de esencia premium de café de especialidad.",
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
        panelDescription:
          "Elige una opción para recibir atención rápida y continuar por WhatsApp.",
        questions: [
          {
            label: "Quiero hacer un pedido",
            message: "Hola, quisiera hacer un pedido en Morales Coffee Market.",
          },
          {
            label: "Preguntar por la esencia de regalo",
            message:
              "Hola, quisiera saber más sobre la botellita de 300 ml de esencia premium de café de especialidad incluida con cualquier compra.",
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
const IS_DEV =
  typeof import.meta !== "undefined" && import.meta.env?.DEV === true;

export const siteConfig = IS_DEV ? reactive(rawConfig) : rawConfig;

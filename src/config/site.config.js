/**
 * CENTRO DE CONFIGURACIÓN — CAFÉ MORALES
 * Migrado desde cafe-del-monte, adaptado a plantilla v2.
 * Preset cafetal + paleta earth (curada, cálida cafetalera).
 * Simplificado: Card genérica, OrderModal simple, deliveryLocations v2, #catalog.
 */
export const siteConfig = {
  site: {
    brand: {
      name: "Café Morales",
      shortName: "CM",
      tagline: "La esencia del café de altura",
      description:
        "Cultivado en las alturas de Jaén y seleccionado para ofrecer una taza dulce, aromática y balanceada. Productores de nuestras propias variedades.",
    },
    seo: {
      title: "Café Morales | Café de especialidad peruano",
      description:
        "Café peruano de especialidad de Jaén, Cajamarca. Catimor, Geisha con Catimor, Geisha y Java. Envíos a todo el Perú.",
      themeColor: "#5c3d2e",
    },
    contact: {
      phone: "51987755593",
      phoneDisplay: "987 755 593",
      email: "",
      address: "Almacén en Lima · Envíos a todo el Perú",
      whatsappDefaultMessage: "Hola, quisiera hacer un pedido de Café Morales.",
    },
  },

  theme: {
    preset: "cafetal",
    palette: "earth",
    typography: "sans-display",
    radius: "xl",
  },

  layout: {
    container: "7xl",
    sectionSpacing: "default",
  },

  navigation: [
    { label: "Catálogo", href: "#catalog", section: "catalog" },
    { label: "Nosotros", href: "#about", section: "about" },
    { label: "Proceso", href: "#benefits", section: "benefits" },
    { label: "Contacto", href: "#contact", section: "contact" },
  ],

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
        eyebrow: "Café de especialidad de Jaén, Cajamarca",
        title: "El carácter de Jaén en cada taza",
        description:
          "Cultivado en las alturas de Jaén y seleccionado para ofrecer una taza dulce, aromática y balanceada. Altura 1500–2000 msnm, procesos Natural, Lavado y Honey.",
        actions: [
          { label: "Descubrir variedades", href: "#catalog", variant: "primary" },
          { label: "Pedir por WhatsApp", href: "#contact", variant: "secondary" },
        ],
        visual: {
          type: "svg",
          name: "hero-coffee",
          aspect: "4 / 3",
          alt: "Ilustración café de altura Jaén",
        },
        highlights: ["1500–2000 msnm", "Natural · Lavado · Honey", "Tueste artesanal"],
      },
    },
    {
      id: "catalog",
      enabled: true,
      order: 20,
      variant: "grid",
      props: {
        eyebrow: "Nuestra cosecha",
        title: "Cafés con perfiles para cada paladar",
        description:
          "Desde cafés dulces y cremosos hasta perfiles más aromáticos y frutales, elige el que mejor se adapte a tu gusto.",
        emptyMessage: "Pronto nuevas cosechas.",
        columns: { base: 1, md: 2, lg: 2 },
        cardVariant: "elevated",
        showFilters: true,
      },
    },
    {
      id: "about",
      enabled: true,
      order: 30,
      variant: "split-reverse",
      props: {
        eyebrow: "Nuestro café",
        title: "Productores de nuestras propias variedades",
        description:
          "En Café Morales somos productores de nuestras propias variedades de café. Origen Jaén - Cajamarca, altura 1500 a 2000 msnm, procesos Natural, Lavado y Honey, perfil dulce, frutal y floral. Cada decisión en la finca protege la calidad del grano y el carácter de su origen.",
        visual: {
          type: "svg",
          name: "about-finca",
          aspect: "4 / 5",
          alt: "Ilustración finca cafetalera",
        },
      },
    },
    {
      id: "benefits",
      enabled: true,
      order: 40,
      variant: "numbered",
      props: {
        eyebrow: "De Jaén a tu taza",
        title: "Un café cuidado en cada etapa",
        description:
          "Desde la selección de las cerezas hasta el tueste, cuidamos cada proceso para conservar la dulzura, el aroma y el carácter del café de Jaén.",
        items: [
          {
            title: "Cosecha",
            description:
              "Cultivado en las zonas altas de Jaén y recolectado cuando las cerezas alcanzan su punto óptimo de maduración.",
            icon: "leaf",
          },
          {
            title: "Beneficio",
            description:
              "Procesado mediante métodos lavado o honey, con fermentación y secado controlados para perfiles limpios y definidos.",
            icon: "shield-check",
          },
          {
            title: "Tueste",
            description:
              "Tostado en lotes para resaltar las características de cada café y lograr una taza dulce, aromática y balanceada.",
            icon: "award",
          },
        ],
      },
    },
    {
      id: "contact",
      enabled: true,
      order: 50,
      variant: "centered",
      props: {
        eyebrow: "Haz tu pedido",
        title: "El verdadero café de especialidad hasta tu hogar",
        description:
          "Escríbenos por WhatsApp y coordinamos tu pedido. Almacén en Lima · Envíos a todo el Perú.",
        note: "Atención directa por WhatsApp · Jaén, Cajamarca · Perú",
        actionLabel: "Escribir al 987 755 593",
      },
    },
    {
      id: "footer",
      enabled: true,
      order: 90,
      variant: "default",
      props: {
        legal: "Todos los derechos reservados.",
        location: "Jaén, Cajamarca · Perú",
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
            message: "Hola, quisiera hacer un pedido de Café Morales. ¿Me ayudan a elegir una variedad?",
          },
          {
            label: "Ver variedades y precios",
            message: "Hola, quisiera conocer las variedades disponibles, sus presentaciones y precios.",
          },
          {
            label: "Consultar envíos",
            message: "Hola, quisiera consultar el costo y tiempo de envío de Café Morales a mi ciudad.",
          },
        ],
      },
    },
  ],

  order: {
    enabled: true,
    units: ["250gr", "500gr", "1kilo", "sacos"],
  },
};

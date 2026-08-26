/**
 * UBICACIONES DE ENTREGA — opcional, solo si order.enabled === true
 * Amplía solo con cobertura confirmada.
 */
export const DELIVERY_LOCATIONS = Object.freeze([
  { province: "Lima", districts: ["Cercado", "Miraflores", "Barranco", "Surco", "La Molina", "San Borja", "Otra zona"] },
  { province: "Callao", districts: ["Callao", "Ventanilla", "Bellavista"] },
  { province: "Otra provincia", districts: ["Distrito por coordinar"] },
]);

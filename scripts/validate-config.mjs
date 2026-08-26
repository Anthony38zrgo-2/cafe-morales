import { siteConfig } from "../src/config/site.config.js";
import { validateConfig } from "../src/config/validate.js";

const errors = validateConfig(siteConfig);
if (errors.length) {
  console.error("Config inválida:");
  errors.forEach((e) => console.error(" - " + e));
  process.exit(1);
}
console.log("✓ Config válida");

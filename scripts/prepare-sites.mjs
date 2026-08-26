import { copyFile, mkdir } from "node:fs/promises";

// OpenAI Sites espera un Worker ESM junto al build estático de Vite.
await mkdir("dist/server", { recursive: true });
await copyFile("worker/sites.js", "dist/server/index.js");

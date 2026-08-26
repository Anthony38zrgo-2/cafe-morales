import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const repository =
    env.VITE_GITHUB_REPOSITORY ||
    env.GITHUB_REPOSITORY?.split("/").at(-1) ||
    process.env.npm_package_name ||
    "cafe-morales";

  return {
    // GitHub Pages necesita /nombre-repositorio/; local y Sites usan /.
    base: mode === "github" && repository ? `/${repository}/` : "/",
    plugins: [vue(), tailwindcss()],
    resolve: {
      alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    },
    test: {
      environment: "jsdom",
      globals: true,
    },
  };
});

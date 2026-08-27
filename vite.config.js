import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import Icons from "unplugin-icons/vite";
import { viteWebfontDownload } from "vite-plugin-webfont-dl";
import { fileURLToPath, URL } from "node:url";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  // Prioridad: VITE_GITHUB_REPOSITORY (custom) > GITHUB_REPOSITORY (CI "owner/repo") > package.json name
  // Soporta tanto .env como process.env (GitHub Actions expone GITHUB_REPOSITORY en process.env)
  const rawRepo =
    env.VITE_GITHUB_REPOSITORY ||
    process.env.VITE_GITHUB_REPOSITORY ||
    env.GITHUB_REPOSITORY ||
    process.env.GITHUB_REPOSITORY ||
    process.env.npm_package_name ||
    "cafe-morales";
  const repository = rawRepo.includes("/") ? rawRepo.split("/").at(-1) : rawRepo;

  return {
    // localhost (dev / build) y Sites usan "/"  |  GitHub Pages (mode github) usa "/<repo>/"
    base: mode === "github" && repository ? `/${repository}/` : "/",
    plugins: [
      vue(),
      tailwindcss(),
      Icons({
        compiler: "vue3",
        autoInstall: true,
        scale: 1,
      }),
      viteWebfontDownload(),
    ],
    resolve: {
      alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    },
    test: {
      environment: "jsdom",
      globals: true,
    },
  };
});

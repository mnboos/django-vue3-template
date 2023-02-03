import { fileURLToPath, URL } from "url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { quasar, transformAssetUrls } from "@quasar/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
    define: {
        "import.meta.vitest": "undefined",
    },
    plugins: [
        vue({
            template: { transformAssetUrls },
        }),
        quasar(),
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    test: {
        environment: "jsdom",
        includeSource: ["src/**/*.{js,ts}"],
        coverage: {
            reporter: ["text", "html"],
            skipFull: true,
        },
    },
});

// https://nuxt.com/docs/api/configuration/nuxt-config
import { definePreset } from "@primeuix/themes";
import Aura from "@primeuix/themes/aura";

const Noir = definePreset(Aura, {
  semantic: {
    colorScheme: {
      light: {
        primary: {
          0: "#ffffff",
          50: "#f2f8f9",
          100: "#dfecee",
          200: "#c2dbdf",
          300: "#80B4BD",
          400: "#679da9",
          500: "#40B9BF",
          600: "#426b78",
          700: "#3a5964",
          800: "#354b55",
          900: "#304149",
          950: "#23333B",
          color: "#40B9BF",
          hoverColor: "#80B4BD",
          activeColor: "#40B9BF",
        },

        surface: {
          0: "#ffffff",
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
          950: "#0f172a",
        },
      },
    },
  },
});

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",

  devtools: { enabled: true },

  modules: [
    "@nuxtjs/tailwindcss",
    "@primevue/nuxt-module",
    "@nuxtjs/supabase",
    "@prisma/nuxt",
  ],

  primevue: {
    options: {
      theme: {
        preset: Noir,
        options: {
          darkModeSelector: ".my-app-dark",
        },
      },
    },
  },

  css: ["primeicons/primeicons.css"],

  supabase: {
    redirect: false,
    serviceKey: process.env.SUPABASE_SERVICE_KEY,
  },

  vite: {
    resolve: {
      alias: {
        ".prisma/client/index-browser":
          "./node_modules/.prisma/client/index-browser.js",
      },
    },
  },

  tailwindcss: {
    exposeConfig: true,
    config: {
      theme: {
        extend: {
          colors: {
            primary: {
              0: "#ffffff",
              50: "#f2f8f9",
              100: "#dfecee",
              200: "#c2dbdf",
              300: "#80B4BD",
              400: "#679da9",
              500: "#40B9BF",
              600: "#426b78",
              700: "#3a5964",
              800: "#354b55",
              900: "#304149",
              950: "#23333B",
            },
          },
          fontFamily: {
            sans: ["Roboto", "sans-serif"],
            title: ["Trade Gothic", "sans-serif"],
          },
        },
      },
      plugins: [require("tailwindcss-primeui")],
    },
  },
});

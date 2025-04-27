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
          50: "{neutral.50}",
          100: "{neutral.100}",
          200: "{neutral.200}",
          300: "{neutral.300}",
          400: "{neutral.400}",
          500: "{neutral.500}",
          600: "{neutral.600}",
          700: "{neutral.700}",
          800: "{neutral.800}",
          900: "{neutral.900}",
          950: "{neutral.950}",
        },
      },
    },
  },
});

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",

  devtools: { enabled: true },

  components: [
    {
      path: "/components/SidebarMenu",
      pathPrefix: false,
    },
  ],

  modules: ["@nuxtjs/tailwindcss", "@primevue/nuxt-module", "@nuxtjs/supabase"],

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

  supabase: {
    redirect: false,
    serviceKey: process.env.SUPABASE_SERVICE_KEY,
  },

  tailwindcss: {
    exposeConfig: true,
    config: [
      { content: ["content/**/**.md"] },
      { plugins: [require("tailwindcss-primeui")] },
      {
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
                900: "#304149",
                950: "#23333B",
              },
            },
          },

          fontFamily: {
            sans: ["Roboto", "sans-serif"],
            title: ["Trade Gothic", "sans-serif"],
          },
        },
      },
    ],
  },
});

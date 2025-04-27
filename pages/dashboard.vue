<script setup>
definePageMeta({
  middleware: ["auth"],
});

import SidebarMenu from "~/components/SidebarMenu.vue";
import GridTopBar from "~/components/GridTopBar.vue";
import GridDashboard from "~/components/GridDashboard.vue";
</script>

<template>
  <main class="grid grid-cols-[300px_1fr] bg-primary-950 pr-8">
    <SidebarMenu />

    <div
      class="bg-neutral-100 rounded-2xl my-8 mx-auto w-full md:max-w-[1440px] justify-center"
    >
      <GridTopBar />
      <GridDashboard />
    </div>
  </main>
</template>

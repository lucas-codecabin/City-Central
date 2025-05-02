<script setup>
import { RouterLink, useRoute } from "vue-router";
import { ref, computed } from "vue";

const adminExpanded = ref(false);
const cityAquaticsExpanded = ref(false);

const route = useRoute();
const currentPath = computed(() => route.path);
</script>

<template>
  <main class="p-8">
    <div class="sticky top-8">
      <div
        class="flex gap-2 w-full justify-center items-center min-h-[90px] border-b border-white/10 sticky"
      >
        <img src="../assets/images/cvm logo.png" alt="CVM Logo" class="w-10" />
        <h1 class="font-title text-2xl uppercase text-white">City Central</h1>
      </div>

      <div class="flex flex-col gap-2 text-white text-sm">
        <!-- Dashboard -->
        <RouterLink
          to="/dashboard"
          :class="`${
            currentPath === '/dashboard' ? 'bg-primary-500' : 'bg-transparent'
          } flex justify-between mt-4 p-2 items-center rounded-lg hover:bg-primary-300 hover:drop-shadow-md`"
        >
          <div class="flex gap-2 items-center">
            <i class="pi pi-chart-bar"></i>
            <p>Dashboard</p>
          </div>
          <i class="pi pi-angle-right"></i>
        </RouterLink>

        <!-- Admin -->
        <div
          :class="`${
            adminExpanded ? 'bg-white/5' : ''
          } flex flex-col rounded-lg border-white hover:border-white transition-all`"
        >
          <a
            @click="
              () => {
                adminExpanded = !adminExpanded;
              }
            "
            :class="`${adminExpanded ? 'rounded-b-none' : ''} ${
              currentPath === '/roles' && 'bg-primary-500'
            } ${
              currentPath === '/users' && 'bg-primary-500'
            }  flex w-full justify-between p-2 items-center rounded-lg border-none hover:bg-primary-300 hover:drop-shadow-md cursor-pointer`"
          >
            <div class="flex gap-2 items-center">
              <i class="pi pi-cog"></i>
              <p>Admin</p>
            </div>
            <i class="pi pi-angle-down"></i>
          </a>

          <div
            :class="`${adminExpanded ? 'block' : 'hidden'}
              flex flex-col text-sm items-center`"
          >
            <RouterLink
              to="/roles"
              :class="`${
                currentPath === '/roles' && 'bg-primary-500'
              } flex w-full justify-between p-2 pl-8 items-center hover:bg-primary-300 hover:drop-shadow-md`"
            >
              <p>Role Management</p>
              <i class="pi pi-angle-right"></i>
            </RouterLink>

            <RouterLink
              to="/users"
              :class="`${
                currentPath === '/users' && 'bg-primary-500'
              } flex w-full justify-between p-2 pl-8 items-center hover:bg-primary-300 hover:drop-shadow-md rounded-b-lg`"
            >
              <p>User Management</p>
              <i class="pi pi-angle-right"></i>
            </RouterLink>
          </div>
        </div>

        <!-- City Aquatics Website -->
        <div
          :class="`${
            cityAquaticsExpanded ? 'bg-white/5' : ''
          } flex flex-col bg-primary-950 rounded-lg border-white hover:border-white transition-all`"
        >
          <a
            @click="
              () => {
                cityAquaticsExpanded = !cityAquaticsExpanded;
              }
            "
            :class="`${
              cityAquaticsExpanded ? 'bg-transparent rounded-b-none' : ''
            } ${
              currentPath === '/website-controller' && 'bg-primary-500'
            } flex w-full justify-between p-2 items-center rounded-lg border-none hover:bg-primary-300 hover:drop-shadow-md cursor-pointer`"
          >
            <div class="flex gap-2 items-center">
              <i class="pi pi-globe"></i>
              <p>City Aquatics Websites</p>
            </div>
            <i class="pi pi-angle-down"></i>
          </a>

          <div
            :class="`${cityAquaticsExpanded ? 'block' : 'hidden'}
              flex flex-col text-sm items-center`"
          >
            <RouterLink
              to="/website-controller"
              :class="`${
                currentPath === '/website-controller' && 'bg-primary-500'
              } flex w-full justify-between p-2 pl-8 items-center hover:bg-primary-300 hover:drop-shadow-md`"
            >
              <p>Websites Controller</p>
              <i class="pi pi-angle-right"></i>
            </RouterLink>

            <RouterLink
              to="#"
              class="flex w-full justify-between p-2 pl-8 items-center hover:bg-primary-300 hover:drop-shadow-md"
            >
              <p>Group Fitness Mgt</p>
              <i class="pi pi-angle-right"></i>
            </RouterLink>

            <RouterLink
              to="#"
              class="flex w-full justify-between p-2 pl-8 items-center hover:bg-primary-300 hover:drop-shadow-md"
            >
              <p>Squad Mgt</p>
              <i class="pi pi-angle-right"></i>
            </RouterLink>

            <RouterLink
              to="#"
              class="flex w-full justify-between p-2 pl-8 items-center hover:bg-primary-300 hover:drop-shadow-md"
            >
              <p>Prices Mgt</p>
              <i class="pi pi-angle-right"></i>
            </RouterLink>

            <RouterLink
              to="#"
              class="flex w-full justify-between p-2 pl-8 items-center hover:bg-primary-300 hover:drop-shadow-md"
            >
              <p>Classes Mgt</p>
              <i class="pi pi-angle-right"></i>
            </RouterLink>

            <RouterLink
              to="#"
              class="flex w-full justify-between p-2 pl-8 items-center hover:bg-primary-300 hover:drop-shadow-md rounded-b-lg"
            >
              <p>Campaign Banner</p>
              <i class="pi pi-angle-right"></i>
            </RouterLink>
          </div>
        </div>

        <!-- Pool Testing -->
        <RouterLink
          to="#"
          :class="`${
            currentPath === '/pool-testing'
              ? 'bg-primary-500'
              : 'bg-transparent'
          } flex justify-between p-2 items-center rounded-lg hover:bg-primary-300 hover:drop-shadow-md`"
        >
          <div class="flex gap-2 items-center">
            <i class="pi pi-list-check"></i>
            <p>Pool Testing</p>
          </div>
          <i class="pi pi-angle-right"></i>
        </RouterLink>

        <!-- Lane Availability -->
        <RouterLink
          to="#"
          :class="`${
            currentPath === '/lane-availability'
              ? 'bg-primary-500'
              : 'bg-transparent'
          } flex justify-between p-2 items-center rounded-lg hover:bg-primary-300 hover:drop-shadow-md`"
        >
          <div class="flex gap-2 items-center">
            <i class="pi pi-chart-line"></i>
            <p>Lane Availability</p>
          </div>
          <i class="pi pi-angle-right"></i>
        </RouterLink>
      </div>
    </div>
  </main>
</template>

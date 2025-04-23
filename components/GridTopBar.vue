<script setup>
import { Button } from "primevue";
import { useRouter } from "vue-router";

const userExpanded = ref(false);

const router = useRouter();
const supabase = useSupabaseClient();

const { data, error } = await supabase.auth.getUser();
const displayUserEmail = data.user.email;

const signOut = async () => {
  await supabase.auth.signOut();
  router.push("/");
};
</script>

<template>
  <div
    class="bg-white border border-b-neutral-300 flex flex-col rounded-t-2xl p-8 items-end relative"
  >
    <a
      @click="
        () => {
          userExpanded = !userExpanded;
        }
      "
      class="flex items-center gap-1 cursor-pointer"
    >
      {{ displayUserEmail }}
      <i class="pi pi-angle-down"></i>
    </a>

    <div v-if="userExpanded" class="absolute bottom-1 right-8">
      <Button
        type="button"
        severity="primary"
        label="Sign Out"
        @click="signOut"
        class="py-1 px-3 font-title rounded-lg text-sm"
      />
    </div>
  </div>
</template>

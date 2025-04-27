<script setup>
import { Button } from "primevue";

const supabase = useSupabaseClient();
const router = useRouter();

const firstName = ref("");
const email = ref("");
const password = ref("");
const selectedRoleId = ref("");

// Fetch all roles
const { data: allRoles, error: allRolesError } = await useAsyncData(
  "all_roles",
  async () => {
    const { data, error } = await supabase.from("roles").select("id, title");
    if (error) throw error;
    return data;
  }
);

// Add user
const addUser = async () => {
  try {
    // Create auth user using SSR Supabase Auth Admin
    const newAuthUser = await $fetch("/api/users/create", {
      method: "POST",
      body: {
        email: email.value,
        password: password.value,
        fName: firstName.value,
      },
    });

    const newUserId = newAuthUser?.id;
    if (!newUserId) throw new Error("User ID not found after signup");

    // Create user on public users table
    const { error: insertError } = await supabase.from("users").insert({
      id: newUserId,
      email: email.value,
      first_name: firstName.value,
      role_id: selectedRoleId.value,
    });

    if (insertError) throw insertError;

    router.push("/users");
  } catch (error) {
    alert("Failed to add user");
    console.error("Failed to add user", error);
  }
};
</script>

<template>
  <div class="flex flex-col p-8 gap-8">
    <h1 class="font-title text-xl uppercase font-bold">Add User</h1>

    <div class="card space-y-8">
      <div class="bg-white">
        <div class="bg-white font-bold p-4 flex flex-col gap-2">
          First Name
          <InputText
            name="firstName"
            type="text"
            v-model="firstName"
            class="px-4 py-2 text-neutral-500 bg-white rounded-lg"
          />
        </div>

        <div class="bg-white font-bold p-4 flex flex-col gap-2">
          Email
          <InputText
            name="email"
            type="email"
            v-model="email"
            class="px-4 py-2 text-neutral-500 bg-white rounded-lg"
          />
        </div>

        <div class="bg-white font-bold p-4 flex flex-col gap-2">
          Password
          <InputText
            name="password"
            type="password"
            v-model="password"
            class="px-4 py-2 text-neutral-500 bg-white rounded-lg"
          />
        </div>

        <div class="bg-white font-bold p-4 flex flex-col gap-2">
          Role
          <Dropdown
            v-model="selectedRoleId"
            :options="allRoles"
            optionLabel="title"
            optionValue="id"
            placeholder="Select a Role"
            class="text-neutral-500 bg-white rounded-lg"
          />
        </div>
      </div>

      <div class="flex gap-4">
        <Button
          type="button"
          severity="primary"
          label="Add User"
          @click="addUser"
          class="py-1 px-4 font-title text-sm rounded-full"
        />
        <RouterLink to="/users"
          ><Button
            type="button"
            severity="primary"
            label="Cancel"
            class="py-1 px-4 font-title text-sm rounded-full bg-white text-primary-950 border-primary-950 hover:!bg-primary-950 hover:!text-white hover:!border-primary-950"
        /></RouterLink>
      </div>
    </div>
  </div>
</template>

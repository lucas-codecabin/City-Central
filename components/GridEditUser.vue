<script setup>
import { Button } from "primevue";

const supabase = useSupabaseClient();
const route = useRoute();
const router = useRouter();
const userId = route.params.id;

const firstName = ref("");
const email = ref("");
const selectedRoleId = ref("");

// Get current user data
const { data: currentUser, error: currentUserError } =
  await supabase.auth.getUser();

// Get current user role
const { data: currentUserDetails, error: currentUserDetailsError } =
  await useAsyncData("current_user_with_role", async () => {
    if (!currentUser) throw new Error("No authenticated user found");

    const { data, error } = await supabase
      .from("user_with_role")
      .select("role_title")
      .eq("user_id", currentUser.user.id)
      .single();

    if (error) throw error;
    return data;
  });

// Fetch user details
const { data: userDetails, error: userDetailsError } = await useAsyncData(
  "user_details",
  async () => {
    const { data, error } = await supabase
      .from("users")
      .select("first_name, email, role_id")
      .eq("id", userId)
      .single();
    if (error) throw error;
    return data;
  }
);

// Fetch all roles
const { data: allRoles, error: allRolesError } = await useAsyncData(
  "all_roles",
  async () => {
    const { data, error } = await supabase.from("roles").select("id, title");
    if (error) throw error;
    return data;
  }
);

watchEffect(() => {
  if (userDetails.value) {
    firstName.value = userDetails.value.first_name;
    email.value = userDetails.value.email;
    selectedRoleId.value = userDetails.value.role_id;
  }
});

// Update user
const updateUser = async () => {
  try {
    const { error } = await supabase
      .from("users")
      .update({
        first_name: firstName.value,
        email: email.value,
        role_id: selectedRoleId.value,
      })
      .eq("id", userId);

    if (error) throw error;

    router.push("/users");
  } catch (error) {
    console.error("Failed to update user", error);
    alert("Failed to update user");
  }
};
</script>

<template>
  <div class="flex flex-col p-8 gap-8">
    <h1 class="font-title text-xl uppercase font-bold">Update User</h1>

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

        <div
          v-if="currentUserDetails.role_title === 'Codecabin'"
          class="bg-white font-bold p-4 flex flex-col gap-2"
        >
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
          label="Update User"
          @click="updateUser"
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

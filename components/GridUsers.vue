<script setup>
import { useToast } from "primevue/usetoast";

const toast = useToast();
const supabase = useSupabaseClient();

const users = ref([]);

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

const fetchUsers = async () => {
  const { data: usersDetails, error } = await supabase
    .from("user_with_role")
    .select();

  if (!error) {
    users.value = usersDetails;
  } else {
    console.error("Error fetching users", error);
  }
};

await fetchUsers();

const deleteUser = async (userId) => {
  const confirmDelete = confirm("Are you sure you want to delete this user?");
  if (!confirmDelete) return;

  // Delete auth user using SSR Supabase Auth Admin
  await $fetch("/api/users/delete", {
    method: "POST",
    body: {
      userId,
    },
  });

  // Delete user on public users table
  const { error: deleteError } = await supabase
    .from("users")
    .delete()
    .eq("id", userId);

  if (!deleteError) {
    await fetchUsers();
  } else {
    toast.add({
      severity: "error",
      summary: "Failed to delete user",
      life: 3000,
    });
    console.error("Failed to delete user", error);
  }
};
</script>

<template>
  <div class="flex flex-col p-8 gap-8">
    <RouterLink
      v-if="currentUserDetails.role_title === 'Codecabin'"
      to="/add/user"
      class="w-fit"
    >
      <Button
        type="button"
        label="Add User"
        severity="primary"
        class="hover:!bg-primary-300"
      />
    </RouterLink>

    <div class="card w-full">
      <DataTable
        :value="users"
        tableStyle="width: 100%"
        stripedRows
        removableSort
        sortField="first_name"
        :sortOrder="1"
      >
        <Column field="first_name" header="User" sortable></Column>

        <Column field="email" header="Email" sortable></Column>

        <Column field="role_title" header="Role" sortable></Column>

        <Column class="!text-center w-10"
          ><template #body="{ data }">
            <RouterLink :to="`/edit/user/${data.user_id}`"
              ><Button
                type="button"
                label="Edit"
                severity="primary"
                class="hover:!bg-primary-300"
              />
            </RouterLink>
          </template>
        </Column>

        <Column
          v-if="currentUserDetails.role_title === 'Codecabin'"
          class="!text-center w-10"
        >
          <template #body="{ data }">
            <Button
              type="button"
              @click="deleteUser(data.user_id)"
              label="Delete"
              severity="primary"
              class="!bg-primary-950 !border-primary-950 hover:!bg-white hover:!border-primary-950 hover:!text-primary-950"
            /> </template
        ></Column>
      </DataTable>
    </div>
  </div>
  <Toast />
</template>

<style scoped>
:root {
  .p-button {
    background: #40b9bf;
    font-size: 14px;
    border-radius: 100px;
    padding: 4px 32px;
  }
}
</style>

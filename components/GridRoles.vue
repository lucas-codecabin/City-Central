<script setup>
const supabase = useSupabaseClient();

const roles = ref([]);

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

const fetchRoles = async () => {
  const { data, error } = await supabase.from("role_access_counts").select();

  if (!error) {
    roles.value = data;
  } else {
    console.error("Error fetching roles", error);
  }
};

await fetchRoles();

const deleteRole = async (roleId) => {
  const confirmDelete = confirm("Are you sure you want to delete this role?");
  if (!confirmDelete) return;

  const { error } = await supabase.from("roles").delete().eq("id", roleId);

  if (!error) {
    await fetchRoles();
  } else {
    console.error("Failed to delete role", error);
    alert("Failed to delete role");
  }
};
</script>

<template>
  <div class="flex flex-col p-8 gap-8">
    <RouterLink
      v-if="currentUserDetails.role_title === 'Codecabin'"
      to="/add/role"
    >
      <Button
        type="button"
        label="Add Role"
        severity="primary"
        class="py-1 px-8 font-title text-sm rounded-full"
      />
    </RouterLink>

    <div class="card">
      <DataTable
        :value="roles"
        tableStyle="width: 100%"
        stripedRows
        removableSort
        sortField="number_of_locations"
        :sortOrder="-1"
      >
        <Column field="role_title" header="Title" sortable></Column>

        <Column
          field="number_of_locations"
          header="Number of Accesses"
          sortable
        ></Column>

        <Column
          v-if="currentUserDetails.role_title === 'Codecabin'"
          class="!text-center w-10"
          ><template #body="{ data }">
            <RouterLink :to="`/edit/role/${data.role_id}`"
              ><Button
                type="button"
                label="Edit"
                severity="primary"
                class="py-1 px-8 font-title text-sm rounded-full"
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
              @click="deleteRole(data.role_id)"
              label="Delete"
              severity="primary"
              class="py-1 px-8 font-title text-sm rounded-full bg-primary-950 border-primary-950"
            /> </template
        ></Column>
      </DataTable>
    </div>
  </div>
</template>

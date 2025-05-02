<script setup>
const supabase = useSupabaseClient();

const locations = ref([]);

// Get current user data
const { data: currentUser, error: currentUserError } =
  await supabase.auth.getUser();

// Get current user role
const { data: currentUserDetails, error: userDetailsError } =
  await useAsyncData("current_user_with_role", async () => {
    if (!currentUser?.user) throw new Error("No authenticated user found");

    const { data, error } = await supabase
      .from("users")
      .select("role_id")
      .eq("id", currentUser.user.id)
      .single();

    if (error) throw error;
    return data;
  });

const fetchLocationsDetails = async () => {
  if (!currentUserDetails.value?.role_id) {
    console.error("Error fetching current user's role.");
    return;
  }

  // Get all location_ids this role can access
  const { data: roleLocations, error: roleLocationsError } = await supabase
    .from("role_locations")
    .select("location_id")
    .eq("role_id", currentUserDetails.value.role_id);

  if (roleLocationsError) {
    console.error("Error fetching locations for this role", roleLocationsError);
    return;
  }

  const locationIds = roleLocations.map((loc) => loc.location_id);

  if (locationIds.length === 0) {
    locations.value = [];
    return;
  }

  // Fetch location details
  const { data: locationsDetails, error: locationsError } = await supabase
    .from("locations")
    .select("id, name, council_region")
    .in("id", locationIds);

  if (!locationsError) {
    locations.value = locationsDetails;
  } else {
    console.error("Error fetching locations details", locationsError);
  }
};

await fetchLocationsDetails();
</script>

<template>
  <div class="flex flex-col p-8 gap-8">
    <div class="card">
      <DataTable
        :value="locations"
        tableStyle="width: 100%"
        stripedRows
        removableSort
        sortField="name"
        :sortOrder="1"
      >
        <Column field="name" header="Site Name" sortable></Column>

        <Column field="council_region" header="Council" sortable></Column>

        <Column class="!text-center w-10"
          ><template #body="{ data }">
            <RouterLink :to="`/services/location/${data.id}`"
              ><Button
                type="button"
                label="Services"
                severity="primary"
                class="!bg-white !text-primary-950 !border-primary-950 hover:!bg-primary-950 hover:!text-white hover:!border-primary-950"
              />
            </RouterLink>
          </template>
        </Column>

        <Column class="!text-center w-10"
          ><template #body="{ data }">
            <RouterLink :to="`/edit/location/${data.id}`"
              ><Button
                type="button"
                label="Edit"
                severity="primary"
                class="hover:!bg-primary-300"
              />
            </RouterLink>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
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

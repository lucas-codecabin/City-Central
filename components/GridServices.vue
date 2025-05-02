<script setup>
const supabase = useSupabaseClient();
const route = useRoute();

const locationId = route.params.id;

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

// Get location name
const { data: locationDetails } = await useAsyncData("location", async () => {
  const { data, error } = await supabase
    .from("locations")
    .select("id, name")
    .eq("id", locationId)
    .single();
  if (error) throw error;
  return data;
});

// Get services offered at this location
const { data: servicesList } = await useAsyncData("services", async () => {
  const { data, error } = await supabase
    .from("services_by_location")
    .select("id, location_id , service_id, services(name)")
    .eq("location_id", locationId);
  if (error) throw error;
  return data;
});
</script>

<template>
  <div class="flex flex-col p-8 gap-8">
    <h1 class="font-title text-xl uppercase font-bold">
      Services for {{ locationDetails?.name }}
    </h1>

    <div class="card">
      <DataTable
        tableStyle="width: 100%"
        :value="servicesList"
        stripedRows
        removableSort
        sortField="services.name"
        :sortOrder="1"
      >
        <Column field="services.name" header="Services" sortable></Column>

        <Column class="!text-center w-10"
          ><template #body="{ data }">
            <RouterLink :to="`/edit/service-location/${data.id}`"
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

    <RouterLink :to="`/website-controller`"
      ><Button
        type="button"
        severity="primary"
        label="Go Back"
        class="!bg-white !text-primary-950 !border-primary-950 hover:!bg-primary-950 hover:!text-white hover:!border-primary-950"
    /></RouterLink>
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

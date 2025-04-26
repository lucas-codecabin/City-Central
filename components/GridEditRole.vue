<script setup>
import { Button } from "primevue";

const supabase = useSupabaseClient();
const route = useRoute();
const router = useRouter();
const roleId = route.params.id;

const newTitle = ref("");
const selectedLocations = ref([]);

// Fetch role details
const { data: roleDetails, error: roleDetailsError } = await useAsyncData(
  "role_details",
  async () => {
    const { data, error } = await supabase
      .from("roles")
      .select("title")
      .eq("id", roleId)
      .single();
    if (error) throw error;
    return data;
  }
);

// Fetch all locations
const { data: allLocations, error: allLocationsError } = await useAsyncData(
  "all_locations",
  async () => {
    const { data, error } = await supabase.from("locations").select();
    if (error) throw error;
    return data;
  }
);

// Fetch locations that this role is authorised
const { data: roleLocations, error: roleLocationsError } = await useAsyncData(
  "role_locations",
  async () => {
    const { data, error } = await supabase
      .from("role_locations")
      .select("location_id")
      .eq("role_id", roleId);
    if (error) throw error;
    return data.map((location) => location.location_id);
  }
);

watchEffect(() => {
  if (!newTitle.value && roleDetails.value?.title) {
    newTitle.value = roleDetails.value.title;
  }

  if (allLocations.value && roleLocations.value) {
    selectedLocations.value = allLocations.value.filter((location) =>
      roleLocations.value.includes(location.id)
    );
  }
});

// Update role title and authorisation
const updateRole = async () => {
  try {
    const { error: updateTitleError } = await supabase
      .from("roles")
      .update({ title: newTitle.value })
      .eq("id", roleId);
    if (updateTitleError) throw updateTitleError;

    const { error: deleteAuthorisationError } = await supabase
      .from("role_locations")
      .delete()
      .eq("role_id", roleId);
    if (deleteAuthorisationError) throw deleteAuthorisationError;

    const newAuthorisation = selectedLocations.value.map((location) => ({
      role_id: roleId,
      location_id: location.id,
    }));

    const { error: insertAuthorisationError } = await supabase
      .from("role_locations")
      .insert(newAuthorisation);
    if (insertAuthorisationError) throw insertAuthorisationError;

    router.push("/roles");
  } catch (error) {
    alert("Failed to update role");
  }
};
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-5 p-8 gap-8">
    <h1 class="font-title text-xl uppercase font-bold col-span-5">
      Update Role
    </h1>

    <div class="card col-span-5 space-y-8">
      <div class="bg-white font-bold p-4 flex flex-col gap-2 pb-8">
        Role Title
        <InputText
          name="newTitle"
          type="text"
          v-model="newTitle"
          class="px-4 py-2 text-neutral-500 bg-white rounded-lg"
        />
      </div>

      <DataTable
        v-if="allLocations"
        v-model:selection="selectedLocations"
        :value="allLocations"
        dataKey="id"
        selectionMode="multiple"
        tableStyle="width: 100%"
      >
        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
        <Column field="name" header="Authorisation"></Column>
      </DataTable>

      <div class="flex gap-4">
        <Button
          type="button"
          severity="primary"
          label="Update Role"
          @click="updateRole"
          class="py-1 px-4 font-title text-sm rounded-full"
        />
        <RouterLink to="/roles"
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

<script setup>
import { Button } from "primevue";
import { useToast } from "primevue/usetoast";

const toast = useToast();
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
    toast.add({
      severity: "error",
      summary: "Failed to update role",
      life: 3000,
    });
    console.error("Failed to update role", error);
  }
};
</script>

<template>
  <div class="flex flex-col p-8 gap-8">
    <h1 class="font-title text-xl uppercase font-bold">Update Role</h1>

    <div class="card space-y-8">
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
          class="hover:!bg-primary-300"
        />
        <RouterLink to="/roles"
          ><Button
            type="button"
            severity="primary"
            label="Cancel"
            class="!bg-white !text-primary-950 !border-primary-950 hover:!bg-primary-950 hover:!text-white hover:!border-primary-950"
        /></RouterLink>
      </div>
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

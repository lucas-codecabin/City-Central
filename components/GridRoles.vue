<script setup>
const supabase = useSupabaseClient();

const { data: roleDetails, error } = await useAsyncData(
  "role_access_counts",
  async () => {
    const { data } = await supabase.from("role_access_counts").select();
    return data;
  }
);
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-5 p-8 gap-8">
    <RouterLink to="/add-role" class="col-span-5">
      <Button
        type="button"
        label="Add Role"
        severity="primary"
        class="py-1 px-8 font-title rounded-full"
      />
    </RouterLink>

    <div class="card col-span-5">
      <DataTable
        :value="roleDetails"
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

        <Column class="!text-center max-w-fit"
          ><template #body="{ data }">
            <RouterLink :to="`/edit-role/${data.role_id}`"
              ><Button
                type="button"
                label="Edit"
                severity="primary"
                class="py-1 px-8 font-title rounded-full"
              />
            </RouterLink>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

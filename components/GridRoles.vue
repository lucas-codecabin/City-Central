<script setup>
const supabase = useSupabaseClient();

const { data: rolesWithAccess, error } = await useAsyncData(
  "role_access_counts",
  async () => {
    const { data } = await supabase.from("role_access_counts").select();
    return data;
  }
);
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-5 p-8 gap-8">
    <div class="card col-span-5">
      <DataTable
        :value="rolesWithAccess"
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
      </DataTable>
    </div>
  </div>
</template>

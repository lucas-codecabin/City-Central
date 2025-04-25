<script setup>
const supabase = useSupabaseClient();

const { data: userDetails, error } = await useAsyncData(
  "user_with_role",
  async () => {
    const { data } = await supabase.from("user_with_role").select();
    return data;
  }
);
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-5 p-8 gap-8">
    <div class="card col-span-5">
      <DataTable
        :value="userDetails"
        tableStyle="width: 100%"
        stripedRows
        removableSort
        sortField="first_name"
        :sortOrder="1"
      >
        <Column field="first_name" header="User" sortable></Column>
        <Column field="email" header="Email" sortable></Column>
        <Column field="role_title" header="Role" sortable></Column>
      </DataTable>
    </div>
  </div>
</template>

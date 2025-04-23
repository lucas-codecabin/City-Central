<script setup>
const supabase = useSupabaseClient();

const { data, error } = await supabase.auth.getUser();
const displayUserName = data.user.user_metadata.fName;
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-5 p-8 gap-8">Roles Bla Bla Bla</div>
</template>

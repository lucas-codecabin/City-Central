<script setup>
import { useToast } from "primevue/usetoast";

const toast = useToast();
const supabase = useSupabaseClient();
const route = useRoute();
const router = useRouter();
const serviceLocationId = route.params.id;

const page_title = ref("");
const phone = ref("");
const email = ref("");
const seo_title = ref("");
const seo_description = ref("");
const page_content = ref("");

// Get current user data
const { data: currentUser, error: currentUserError } =
  await supabase.auth.getUser();

// Get current user role
const { data: currentUserDetails, error: currentUserDetailsError } =
  await useAsyncData("current_user_with_role", async () => {
    if (!currentUser.user) throw new Error("No authenticated user found");

    const { data, error } = await supabase
      .from("user_with_role")
      .select("role_title")
      .eq("user_id", currentUser.user.id)
      .single();

    if (error) throw error;
    return data;
  });

// Get service details
const { data: serviceLocationDetails } = await useAsyncData(
  "service-location-details",
  async () => {
    const { data, error } = await supabase
      .from("services_by_location")
      .select("id, location_id, locations(name) , service_id, services(name)")
      .eq("id", serviceLocationId)
      .single();
    if (error) throw error;
    return data;
  }
);

const { data: serviceDetails } = await useAsyncData(
  "service-details",
  async () => {
    const { data, error } = await supabase
      .from("service_details")
      .select()
      .eq("service_location_id", serviceLocationId)
      .maybeSingle();
    if (error) throw error;
    return data;
  }
);

watchEffect(() => {
  if (serviceDetails.value) {
    page_title.value = serviceDetails.value.page_title;
    phone.value = serviceDetails.value.phone;
    email.value = serviceDetails.value.email;
    seo_title.value = serviceDetails.value.seo_title;
    seo_description.value = serviceDetails.value.seo_description;
    page_content.value = serviceDetails.value.page_content;
  }
});

// Update Service
const updateService = async () => {
  try {
    if (serviceDetails.value !== null) {
      const { error: serviceUpdateError } = await supabase
        .from("service_details")
        .update({
          page_title: page_title.value,
          phone: phone.value,
          email: email.value,
          seo_title: seo_title.value,
          seo_description: seo_description.value,
          page_content: page_content.value,
        })
        .eq("service_location_id", serviceLocationId);

      if (serviceUpdateError) throw serviceUpdateError;
    } else {
      const { error: createServiceError } = await supabase
        .from("service_details")
        .insert({
          service_location_id: serviceLocationId,
          page_title: page_title.value,
          phone: phone.value,
          email: email.value,
          seo_title: seo_title.value,
          seo_description: seo_description.value,
          page_content: page_content.value,
        });

      if (createServiceError) throw createServiceError;
    }

    await fetch("https://hook.eu2.make.com/1m2odhfrpi1mnuddx21tbovdfkei7ptg", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service_location_id: serviceLocationId,
        location_name: serviceLocationDetails.value?.locations?.name,
        service_name: serviceLocationDetails.value?.services?.name,
        page_title: page_title.value,
        phone: phone.value,
        email: email.value,
        seo_title: seo_title.value,
        seo_description: seo_description.value,
        page_content: page_content.value,
      }),
    });

    router.push(
      `/services/location/${serviceLocationDetails.value.location_id}`
    );
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Failed to update or create service",
      life: 3000,
    });
    console.error("Failed to update or create service", error);
  }
};
</script>

<template>
  <div class="flex flex-col p-8 gap-8">
    <h1 class="font-title text-xl uppercase font-bold">
      Update
      <span class="text-primary-500">{{
        serviceLocationDetails.services.name
      }}</span>
      at {{ serviceLocationDetails.locations.name }}
    </h1>

    <div class="card space-y-8">
      <div class="bg-white grid grid-cols-4">
        <div class="bg-white font-bold p-4 flex flex-col gap-2 col-span-4">
          Page Title
          <InputText
            name="page_title"
            type="text"
            v-model="page_title"
            class="font-normal"
          />
        </div>

        <div class="bg-white font-bold p-4 flex flex-col gap-2 col-span-2">
          Email
          <InputText
            name="email"
            type="email"
            v-model="email"
            class="font-normal"
          />
        </div>

        <div class="bg-white font-bold p-4 flex flex-col gap-2 col-span-2">
          Phone
          <InputText
            name="phone"
            type="tel"
            v-model="phone"
            class="font-normal"
          />
        </div>

        <div class="bg-white font-bold p-4 flex flex-col gap-2 col-span-4">
          SEO Title
          <InputText
            name="seo_title"
            type="text"
            v-model="seo_title"
            class="font-normal"
          />
        </div>

        <div class="bg-white font-bold p-4 flex flex-col gap-2 col-span-4">
          SEO Description
          <Textarea
            name="seo_description"
            autoResize
            rows="2"
            v-model="seo_description"
            class="font-normal"
          />
        </div>

        <div class="bg-white font-bold p-4 flex flex-col gap-2 col-span-4">
          Page Content
          <Textarea
            name="page_content"
            autoResize
            rows="3"
            v-model="page_content"
            class="font-normal"
          />
        </div>
      </div>

      <div class="flex gap-4">
        <Button
          type="button"
          severity="primary"
          label="Update Service"
          @click="updateService"
          class="hover:!bg-primary-300"
        />
        <RouterLink
          :to="`/services/location/${serviceLocationDetails.location_id}`"
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

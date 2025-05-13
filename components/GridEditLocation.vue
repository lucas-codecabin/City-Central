<script setup>
import { useToast } from "primevue/usetoast";

const toast = useToast();
const supabase = useSupabaseClient();
const route = useRoute();
const router = useRouter();
const locationId = route.params.id;

const selectedServices = ref([]);
const allServices = ref([]);

const name = ref("");
const phone = ref("");
const email = ref("");
const street = ref("");
const suburb = ref("");
const zip_code = ref("");
const state = ref("");
const council_name = ref("");
const council_region = ref("");
const council_website = ref("");
const seo_title = ref("");
const seo_description = ref("");
const site_description = ref("");
const services_enabled = ref("");
const operating_hours = ref("");
const social_links = ref("");

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

// Fetch location details
const { data: locationDetails, error: locationDetailsError } =
  await useAsyncData("location", async () => {
    const { data, error } = await supabase
      .from("locations")
      .select()
      .eq("id", locationId)
      .single();
    if (error) throw error;
    return data;
  });

// Fetch all available services
const { data: servicesList } = await useAsyncData("all_services", async () => {
  const { data, error } = await supabase
    .from("services")
    .select("id, name")
    .order("name", { ascending: true });
  if (error) throw error;
  return data;
});

allServices.value = servicesList.value || [];

const { data: enabledServicesList } = await useAsyncData(
  "enabled_services",
  async () => {
    const { data, error } = await supabase
      .from("services_by_location")
      .select("service_id")
      .eq("location_id", locationId);
    if (error) throw error;
    return data;
  }
);

selectedServices.value = allServices.value.filter((service) =>
  enabledServicesList.value.some((enabled) => enabled.service_id === service.id)
);

watchEffect(() => {
  if (locationDetails.value) {
    name.value = locationDetails.value.name;
    phone.value = locationDetails.value.phone;
    email.value = locationDetails.value.email;
    street.value = locationDetails.value.street;
    suburb.value = locationDetails.value.suburb;
    zip_code.value = locationDetails.value.zip_code;
    state.value = locationDetails.value.state;
    council_name.value = locationDetails.value.council_name;
    council_region.value = locationDetails.value.council_region;
    council_website.value = locationDetails.value.council_website;
    seo_title.value = locationDetails.value.seo_title;
    seo_description.value = locationDetails.value.seo_description;
    site_description.value = locationDetails.value.site_description;
    services_enabled.value = locationDetails.value.services_enabled;
    operating_hours.value = locationDetails.value.operating_hours;
    social_links.value = locationDetails.value.social_links;
  }
});

// Update Location + Services
const updateLocation = async () => {
  try {
    const { error: locationUpdateError } = await supabase
      .from("locations")
      .update({
        name: name.value,
        phone: phone.value,
        email: email.value,
        street: street.value,
        suburb: suburb.value,
        zip_code: zip_code.value,
        state: state.value,
        council_name: council_name.value,
        council_region: council_region.value,
        council_website: council_website.value,
        seo_title: seo_title.value,
        seo_description: seo_description.value,
        site_description: site_description.value,
      })
      .eq("id", locationId);

    if (locationUpdateError) throw locationUpdateError;

    // Compare selected services vs previously enabled
    const selectedIds = selectedServices.value.map((s) => s.id);
    const previouslyEnabledIds = enabledServicesList.value.map(
      (s) => s.service_id
    );

    const toAdd = selectedIds.filter(
      (id) => !previouslyEnabledIds.includes(id)
    );
    const toRemove = previouslyEnabledIds.filter(
      (id) => !selectedIds.includes(id)
    );

    // Add new services
    if (toAdd.length > 0) {
      const insertData = toAdd.map((id) => ({
        location_id: locationId,
        service_id: id,
      }));
      const { error: insertError } = await supabase
        .from("services_by_location")
        .insert(insertData);
      if (insertError) throw insertError;
    }

    // Remove deselected services (after cleaning up service_details)
    if (toRemove.length > 0) {
      // Get the service_by_location IDs to delete service_details
      const { data: linkRows, error: linkError } = await supabase
        .from("services_by_location")
        .select("id")
        .eq("location_id", locationId)
        .in("service_id", toRemove);

      if (linkError) throw linkError;

      const linkIds = linkRows.map((row) => row.id);

      await supabase
        .from("service_details")
        .delete()
        .in("service_location_id", linkIds);

      const { error: deleteError } = await supabase
        .from("services_by_location")
        .delete()
        .eq("location_id", locationId)
        .in("service_id", toRemove);

      if (deleteError) throw deleteError;
    }

    router.push("/website-controller");
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Failed to update location",
      life: 3000,
    });
    console.error("Failed to update location", error);
  }
};
</script>

<template>
  <div class="flex flex-col p-8 gap-8">
    <h1 class="font-title text-xl uppercase font-bold">Update {{ name }}</h1>

    <div class="card space-y-8">
      <div class="bg-white grid grid-cols-4">
        <div class="bg-white font-bold p-4 flex flex-col gap-2 col-span-4">
          Name
          <InputText
            name="name"
            type="text"
            v-model="name"
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

        <div class="bg-white font-bold p-4 flex flex-col gap-2">
          Street
          <InputText
            name="street"
            type="text"
            v-model="street"
            class="font-normal"
          />
        </div>

        <div class="bg-white font-bold p-4 flex flex-col gap-2">
          Suburb
          <InputText
            name="suburb"
            type="text"
            v-model="suburb"
            class="font-normal"
          />
        </div>

        <div class="bg-white font-bold p-4 flex flex-col gap-2">
          Zip Code
          <InputText
            name="zip_code"
            type="text"
            v-model="zip_code"
            class="font-normal"
          />
        </div>

        <div class="bg-white font-bold p-4 flex flex-col gap-2">
          State
          <InputText
            name="state"
            type="text"
            v-model="state"
            class="font-normal"
          />
        </div>

        <div class="bg-white font-bold p-4 flex flex-col gap-2 col-span-2">
          Council Region
          <InputText
            name="council_region"
            type="text"
            v-model="council_region"
            class="font-normal"
          />
        </div>

        <div class="bg-white font-bold p-4 flex flex-col gap-2 col-span-2">
          Council Website
          <InputText
            name="council_website"
            type="text"
            v-model="council_website"
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
          Site Description
          <Textarea
            name="site_description"
            autoResize
            rows="3"
            v-model="site_description"
            class="font-normal"
          />
        </div>

        <div class="bg-white p-4 flex flex-col gap-2 col-span-4">
          <DataTable
            v-if="allServices"
            v-model:selection="selectedServices"
            :value="allServices"
            dataKey="id"
            selectionMode="multiple"
            :selectionKey="'id'"
            tableStyle="width: 100%"
          >
            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
            <Column
              field="name"
              header="Services available at this location"
            ></Column>
          </DataTable>
        </div>
      </div>

      <div class="flex gap-4">
        <Button
          type="button"
          severity="primary"
          label="Update Location"
          @click="updateLocation"
          class="hover:!bg-primary-300"
        />
        <RouterLink to="/website-controller"
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

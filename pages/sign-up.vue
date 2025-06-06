<script setup>
import { Form } from "@primevue/forms";
import { reactive } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";

const toast = useToast();
const supabase = useSupabaseClient();
const router = useRouter();

const initialValues = reactive({
  fName: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const resolver = ({ values }) => {
  const errors = {};

  if (!values.fName) {
    errors.fName = [{ message: "Full name is required." }];
  }
  if (!values.email) {
    errors.email = [{ message: "Email is required." }];
  }
  if (!values.password) {
    errors.password = [{ message: "Password is required." }];
  }
  if (!values.confirmPassword) {
    errors.confirmPassword = [
      { message: "Password confirmation is required." },
    ];
  }

  return {
    values,
    errors,
  };
};

const signUp = async ({ values, valid }) => {
  if (valid) {
    if (values.password === values.confirmPassword) {
      try {
        const { data } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: {
              fName: values.fName,
            },
          },
        });

        if (data?.user) {
          const { error: supabaseError } = await supabase.from("users").insert([
            {
              id: data.user.id,
              email: data.user.email,
              first_name: data.user.user_metadata.fName,
            },
          ]);
          router.push("/dashboard");

          if (supabaseError) {
            console.error(supabaseError);
          }
        }
      } catch {
        console.error("Failed to sign up user");
        toast.add({
          severity: "error",
          summary: "Failed to sign up user",
          life: 3000,
        });
      }
    } else {
      toast.add({
        severity: "error",
        summary: "Passwords do not match",
        life: 3000,
      });
    }
  }
};
</script>

<template>
  <main class="flex mx-auto min-h-[100dvh]">
    <section
      class="flex flex-col w-[50dvw] bg-[url(/assets/images/sign-up.jpg)] bg-cover bg-top relative"
    >
      <img
        src="/assets/images/cvm logo.png"
        class="w-[72px] absolute top-16 left-16"
      />
    </section>

    <section
      class="container flex flex-col w-[50dvw] justify-center bg-neutral-200 text-primary-950 py-8"
    >
      <div class="container flex flex-col items-center">
        <div class="w-[80%] 2xl:w-[70%] space-y-8">
          <h1 class="text-4xl font-bold text-center font-title uppercase">
            Welcome to city central
          </h1>
          <p class="text-justify">
            We believe that well-managed facilities are much more than just
            bricks and mortar. They're destinations that form the heart of a
            city. Our mission is for our facilities to become places where
            communities can connect and energise. In everything we do, we ensure
            this mission is at the forefront.
          </p>
        </div>

        <div
          class="p-8 rounded-2xl bg-neutral-100 text-primary-950 w-[70%] 2xl:w-[50%] mt-10 text-center space-y-2"
        >
          <h2 class="text-2xl uppercase font-title font-bold">Get Started</h2>
          <p>Enter your details to sign up</p>

          <Form
            v-slot="$form"
            :initialValues
            :resolver
            @submit="signUp"
            class="flex flex-col gap-4 w-full lg:w-80 mx-auto"
          >
            <InputText
              name="fName"
              type="text"
              placeholder="Enter your first name"
            />

            <InputText
              name="email"
              type="email"
              placeholder="Enter your email"
            />

            <InputText
              name="password"
              type="password"
              placeholder="Enter your password"
            />

            <InputText
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
            />

            <Button
              type="submit"
              severity="normal"
              label="Sign Up"
              class="hover:!bg-primary-300"
            />
          </Form>

          <p class="pt-4 text-sm">
            Already have an account?
            <RouterLink to="/" class="text-primary-500 hover:text-primary-300"
              >Sign In</RouterLink
            >
          </p>
        </div>
      </div>
    </section>
    <Toast />
  </main>
</template>

<style scoped>
:root {
  .p-button {
    background: #40b9bf;
    font-size: 14px;
    text-transform: uppercase;
    border-radius: 100px;
  }
}
</style>

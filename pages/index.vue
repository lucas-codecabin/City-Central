<script setup>
import { Form } from "@primevue/forms";
import { reactive } from "vue";
import { RouterLink, useRouter } from "vue-router";

const router = useRouter();
const supabase = useSupabaseClient();

const initialValues = reactive({
  email: "",
  password: "",
});

const resolver = ({ values }) => {
  const errors = {};

  if (!values.email) {
    errors.email = [{ message: "Email is required." }];
  }
  if (!values.password) {
    errors.password = [{ message: "Password is required." }];
  }

  return {
    values,
    errors,
  };
};

const signIn = async ({ values, valid }) => {
  if (valid) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (data.user != null) {
        router.push("/dashboard");
        console.log("User signed in successfully");
      } else {
        alert(error.message);
      }
    } catch (error) {
      console.error("Failed to sign in", error);
    }
  }
};
</script>

<template>
  <main class="flex mx-auto min-h-[100dvh]">
    <section
      class="flex flex-col w-[50dvw] bg-[url(/assets/images/sign-in.jpg)] bg-cover bg-right relative"
    >
      <img
        src="/assets/images/cvm logo.png"
        class="w-[72px] absolute top-16 left-16"
      />
    </section>

    <section
      class="container flex flex-col w-[50dvw] justify-center bg-primary-950 text-white py-8"
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
          <h2 class="text-2xl uppercase font-title font-bold">
            It's good to see you again
          </h2>
          <p>Enter your details to sign in to your account</p>

          <Form
            v-slot="$form"
            :initialValues
            :resolver
            @submit="signIn"
            class="flex flex-col gap-4 w-full lg:w-80 mx-auto"
          >
            <div class="flex flex-col">
              <InputText
                name="email"
                type="email"
                placeholder="Enter your email"
              />
              <Message
                v-if="$form.email?.invalid"
                class="bg-transparent text-xs p-0 m-0 text-red-600 !outline-none"
                >{{ $form.email.error?.message }}</Message
              >
            </div>

            <div class="flex flex-col">
              <InputText
                name="password"
                type="password"
                placeholder="Enter your password"
              />
              <Message v-if="$form.password?.invalid">{{
                $form.password.error?.message
              }}</Message>
            </div>

            <Button type="submit" severity="primary" label="Sign In" />
          </Form>

          <RouterLink
            to="#"
            class="text-primary-500 text-sm hover:text-primary-300"
            >Forgot your password?</RouterLink
          >

          <p class="pt-4 text-sm">
            Don't have an account yet?
            <RouterLink
              to="/sign-up"
              class="text-primary-500 hover:text-primary-300"
              >Sign Up</RouterLink
            >
          </p>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
:root {
  .p-button {
    background: #40b9bf;
    font-size: 14px;
    border-radius: 100px;
  }
  .p-button:hover {
    background: #80b4bd;
  }
}
</style>

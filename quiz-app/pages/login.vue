<template>
  <div class="font-base text-[#333]">
    <div class="bg-dark">
      <div v-if="!isHidden" class="w-full max-w-sm px-4">
        <div>
          <form @submit.prevent="login">
            <div class="mb-12">
              <h3 class="form-heading">Sign in</h3>
              <p class="form-subtext">
                Don't have an account
                <a @click="isHidden = true" class="text-link">Register here</a>
              </p>
            </div>
            <div>
              <label class="label-text">Email</label>
              <input
                v-model="credentials.email"
                type="email"
                required
                class="input-base input-email"
                placeholder="Enter email"
              />
            </div>
            <div class="mt-8">
              <label class="label-text">Password</label>
              <input
                v-model="credentials.password"
                type="password"
                required
                class="input-base input-password"
                placeholder="Enter password"
              />
            </div>
            <div class="mt-12">
              <button type="submit" class="btn btn-purple">Sign in</button>
            </div>
          </form>
        </div>
      </div>
      <div v-else class="w-full max-w-sm px-4">
        <div>
          <form @submit.prevent="register">
            <div class="mb-12">
              <h3 class="form-heading">Register</h3>
              <p class="form-subtext">
                Already have an account?
                <a @click="isHidden = false" class="text-link">Login here</a>
              </p>
            </div>
            <div>
              <label class="label-text">Username</label>
              <input
                v-model="credentials.full_name"
                type="username"
                class="input-base input-email"
                placeholder="Enter username"
              />
            </div>
            <div class="mt-5">
              <label class="label-text">Email</label>
              <input
                v-model="credentials.email"
                type="email"
                class="input-base input-email"
                placeholder="Enter email"
              />
            </div>
            <div class="mt-5">
              <label class="label-text">Password</label>
              <input
                v-model="credentials.password"
                type="password"
                class="input-base input-password"
                placeholder="Enter password"
              />
            </div>
            <div class="mt-12">
              <button type="submit" class="btn btn-purple">Register</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Credentials } from "~/types/credentials";

definePageMeta({
  middleware: "unauth",
});

const isHidden = ref(false);
const supaAuth = useSupabaseClient().auth;

const credentials = reactive<Credentials>({
  full_name: "",
  email: "",
  password: "",
});

const login = async () => {
  const { error } = await supaAuth.signInWithPassword(credentials);
  if (error) {
    alert(error.message);
  } else {
    return navigateTo("/");
  }
};

const register = async () => {
  const { data, error } = await supaAuth.signUp({
    email: credentials.email,
    password: credentials.password,
    options: {
      data: {
        full_name: credentials.full_name,
      },
    },
  });
  if (error) {
    alert(error.message);
  } else {
    return navigateTo("/");
  }
};
</script>

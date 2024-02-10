<template>
  <div class="font-sans text-[#333]">
    <div
      class="min-h-screen flex flex-col items-center justify-center dark:bg-slate-800"
    >
      <div v-if="!isHidden">
        <div>
          <form @submit.prevent="login">
            <div class="mb-12">
              <h3 class="text-3xl font-extrabold text-slate-50">Sign in</h3>
              <p class="text-sm mt-4 text-slate-50">
                Don't have an account
                <a
                  @click="isHidden = true"
                  class="text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap"
                  >Register here</a
                >
              </p>
            </div>
            <div>
              <label class="text-xs block mb-2 text-slate-50">Email</label>
              <input
                v-model="credentials.email"
                type="email"
                required
                class="w-full text-sm border-b border-gray-300 focus:border-[#333] px-2 py-3 outline-none"
                placeholder="Enter email"
              />
            </div>
            <div class="mt-8">
              <label class="text-xs block mb-2 text-slate-50">Password</label>
              <input
                v-model="credentials.password"
                type="password"
                required
                class="w-full text-sm border-b border-gray-300 focus:border-[#333] px-2 py-3 outline-none"
                placeholder="Enter password"
              />
            </div>
            <div class="mt-12">
              <button
                type="submit"
                class="w-full shadow-xl py-2.5 px-4 text-sm font-semibold rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
      <div
        v-else
        class="min-h-screen flex flex-col items-center justify-center dark:bg-slate-800"
      >
        <div>
          <form @submit.prevent="register">
            <div class="mb-12">
              <h3 class="text-3xl font-extrabold text-slate-50">Register</h3>
              <p class="text-sm mt-4 text-slate-50">
                Already have an account?
                <a
                  @click="isHidden = false"
                  class="text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap"
                  >Login here</a
                >
              </p>
            </div>
            <div>
              <label class="text-xs block mb-2 text-slate-50">Email</label>
              <input
                v-model="credentials.email"
                type="email"
                required
                class="w-full text-sm border-b focus:border-[#] px-2 py-3 outline-none"
                placeholder="Enter email"
              />
            </div>
            <div class="mt-8">
              <label class="text-xs block mb-2 text-slate-50">Password</label>
              <input
                v-model="credentials.password"
                type="password"
                required
                class="w-full text-sm border-b border-gray-300 focus:border-[#333] px-2 py-3 outline-none"
                placeholder="Enter password"
              />
            </div>
            <div class="mt-12">
              <button
                type="submit"
                class="w-full shadow-xl py-2.5 px-4 text-sm font-semibold rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "unauth",
});

const isHidden = ref(false);
const supaAuth = useSupabaseClient().auth;
const credentials = reactive({
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
  const { error } = await supaAuth.signUp(credentials);
  if (error) {
    alert(error.message);
  } else {
    return navigateTo("/");
  }
};
</script>

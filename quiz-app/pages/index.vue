<template>
  <div
    class="min-h-screen bg-gray-100 flex flex-col justify-center items-center"
  >
    <h1 class="text-4xl font-bold text-gray-800 mb-8">Index</h1>
    <button
      @click="logout"
      class="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
    >
      Logout
    </button>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: "auth",
});

const supaAuth = useSupabaseClient().auth;
const logout = async () => {
  const { error } = await supaAuth.signOut();
  if (error) {
    alert(error.message);
  } else {
    return navigateTo("/login");
  }
};
</script>

<template>
  <div class="font-base text-[#333] bg-dark min-h-screen">
    <header class="w-full flex justify-between items-center px-4 py-2">
      <div class="flex justify-start">
        <h1 class="form-heading m-4">
          Hello, {{ user.user_metadata.full_name }}!
        </h1>
      </div>
      <div class="flex justify-end m-4">
        <button @click="logout" class="btn btn-purple m-0">Logout</button>
      </div>
    </header>
    <main><Boxes /></main>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: "auth",
});

const user = useSupabaseUser();
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

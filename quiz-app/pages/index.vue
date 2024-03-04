<template>
  <div class="font-base text-[#333] bg-dark min-h-screen flex flex-col">
    <header class="w-full flex justify-between items-start px-4 pt-2">
      <div>
        <h1 class="form-heading m-4">
          Hello, {{ user.user_metadata.full_name }}!
        </h1>
      </div>
      <div class="m-4">
        <button @click="logout" class="btn btn-purple m-0">Logout</button>
      </div>
    </header>
    <div class="flex-grow w-full p-4">
      <Category />
      <Boxes />
    </div>
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

<style scoped>
.flex-grow {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
</style>

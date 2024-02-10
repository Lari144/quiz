<template>
  <div>
    <h1>Index</h1>
    <button @click="logout"></button>
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

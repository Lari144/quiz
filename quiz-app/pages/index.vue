<template>
  <div
    style="background-color: #121212 !important"
    class="font-base text-[#333] bg-dark min-h-screen flex flex-col"
  >
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
      <Category
        @input-value="handleInputValue"
        @search-type-change="handleSearchTypeChange"
      />
      <Boxes :searchQuery="searchQuery" :searchType="searchType" />
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: "auth",
});

const searchQuery = ref("");
const user = useSupabaseUser();
const supaAuth = useSupabaseClient().auth;
const searchType = ref("title");

const handleSearchTypeChange = (value) => {
  searchType.value = value;
};

const handleInputValue = (value) => {
  searchQuery.value = value;
};

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

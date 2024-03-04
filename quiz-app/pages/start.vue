<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
  />
  <div
    class="font-base text-[#333] bg-dark min-h-screen flex flex-col start-from-top"
  >
    <header class="w-full flex justify-between items-center px-4 py-4">
      <button
        @click="routeTo"
        class="text-white hover:text-gray-300 font-semibold"
      >
        Go back
      </button>
    </header>
    <div class="w-full flex flex-col items-center">
      <div></div>
    </div>
  </div>
</template>

<script setup lang="ts">
const routeTo = () => {
  navigateTo("/");
};
</script>

<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
  />
  <div
    class="font-base w-full text-[#333] bg-dark min-h-screen flex flex-col start-from-top"
  >
    <header class="w-full flex justify-between items-start px-4 pt-2">
      <button
        @click="routeTo"
        class="text-white hover:text-gray-300 font-semibold text-xl"
      >
        Go back
      </button>
      <div>
        <button
          @click="showCheck"
          class="text-white hover:text-gray-300 font-semibold text-xl"
        >
          Check
        </button>
        <button
          @click="showMultipleChoice"
          class="text-white hover:text-gray-300 font-semibold text-xl"
        >
          Multiple Choice
        </button>
      </div>
    </header>
    <div class="flex-grow w-full">
      <Check v-if="currentView === 'Check'" />
      <MultipleChoice v-else-if="currentView === 'MultipleChoice'" />
    </div>
  </div>
</template>

<script setup lang="ts">
const currentView = ref("");

const showCheck = () => {
  currentView.value = "Check";
};

const showMultipleChoice = () => {
  currentView.value = "MultipleChoice";
};
const routeTo = () => {
  navigateTo("/");
};
</script>

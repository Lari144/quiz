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
    </header>
    <div class="flex-grow w-full flex items-center justify-center">
      <div v-if="!currentView" class="text-center">
        <h1 class="text-white text-2xl">Select an option to get started</h1>
        <div class="p-20">
          <button
            @click="showCheck"
            class="text-white hover:bg-light-purple bg-input-bg font-semibold m-2 btn"
          >
            Check
          </button>
          <button
            @click="showCheck"
            class="hover:bg-light-purple bg-input-bg font-semibold m-2 btn flex flex-col items-center justify-center"
          >
            <span class="text-white">Check</span>
            <span class="font-light text-gray-300 text-sm">(with skips)</span>
          </button>
          <button
            @click="showMultipleChoice"
            class="text-white hover:bg-light-purple bg-input-bg font-semibold m-2 btn"
          >
            Multiple Choice
          </button>
          <button
            @click="showMultipleChoice"
            class="hover:bg-light-purple bg-input-bg font-semibold m-2 btn flex flex-col items-center justify-center"
          >
            <span class="text-white">Multiple Choice</span>
            <span class="text-gray-300 font-light text-sm">(with skips)</span>
          </button>
        </div>
      </div>
      <Check v-else-if="currentView === 'Check'" />
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

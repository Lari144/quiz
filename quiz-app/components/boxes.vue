<template>
  <div class="p-6">
    <div class="flex flex-wrap gap-4">
      <div
        v-if="boxes.length === 0"
        @click="addBox"
        class="cursor-pointer flex justify-center items-center w-64 h-32 bg-input-bg rounded-lg text-4xl text-mid-purple hover:text-dark-purple hover:bg-darker-grey transition-colors"
      >
        +
      </div>
      <div
        v-for="(box, index) in boxes"
        :key="index"
        class="w-64 h-32 bg-darker-grey rounded-lg flex justify-center items-center"
      >
        <span
          v-if="index === 0"
          @click="addBox"
          class="cursor-pointer text-4xl text-gray-600"
          >+</span
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const boxes = ref([]);

function addBox() {
  boxes.value.push({});
}
</script>

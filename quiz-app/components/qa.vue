<template>
  <button @click="closeModal">
    cancel
  </button>
  <div
    class="bg-darker-grey rounded-lg flex flex-col items-center justify-center p-3 text-white text-center"
    style="width: 100%; height: 100%"
  >
  <input v-model="question" class="text-white input-base border-darker-grey focus:border-dark-purple"></input>
  </div>
  <div
    class="bg-darker-grey rounded-lg flex flex-col items-center justify-center p-3 text-white text-center"
    style="width: 100%; height: 100%"
  >
  <input v-model="answer" class="text-white input-base border-darker-grey focus:border-dark-purple"></input>
  </div>
  <button @click="submit">
    add
  </button>
</template>

<script setup>
const emits = defineEmits(["update:showModal", "submit"]);

const question = ref("");
const answer = ref("");

const closeModal = () => {
  emits("update:showModal", false);
};

const submit = () => {
  emits("submit", { question: question.value, answer: answer.value });
  closeModal();
};
</script>

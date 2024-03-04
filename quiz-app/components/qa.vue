<template>
  <button class="p-3 hover:text-slate-200" @click="closeModal">Cancel</button>
  <div class="w-full bg-dark-bg rounded-lg shadow p-4">
    <input
      v-model="question"
      class="w-full text-white p-4 bg-transparent border border-darker-grey focus:border-dark-purple rounded-md"
      placeholder="Enter question here..."
    />
  </div>
  <div class="w-full bg-dark-bg rounded-lg shadow p-4">
    <input
      v-model="answer"
      class="w-full text-white p-4 bg-transparent border border-darker-grey focus:border-dark-purple rounded-md"
      placeholder="Enter answer here..."
    />
  </div>
  <button
    class="btn btn-purple custom-width text-lg text-white"
    @click="submit"
  >
    Add
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

<style scoped>
.custom-width {
  width: 120px;
  margin-left: auto;
  margin-right: auto;
  display: block;
}
</style>

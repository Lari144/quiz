<template>
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
      <div
        v-for="(question, index) in questions"
        :key="index"
        class="w-9/12 bg-darker-grey rounded-lg shadow-md p-3 mb-4 text-slate-100"
      >
        {{ question.text }}
        <div
          v-for="(answer, index) in filteredAnswers(question.id)"
          :key="index"
          class="mt-2 p-2 bg-input-bg rounded-md"
        >
          {{ answer.text }}
        </div>
      </div>
    </div>
    <div v-if="showModal" class="w-9/12 self-center">
      <Qa @update:showModal="showModal = $event" @submit="addQuestions" />
    </div>
    <button
      v-if="!showModal"
      class="w-6/12 bg-input-bg hover:bg-darker-grey text-mid-purple hover:text-dark-purple font-bold py-2 px-4 rounded-full self-center mt-4"
      @click="showModal = true"
    >
      +
    </button>
  </div>
</template>

<script setup>
import {
  addRecord,
  fetchRecords,
  addRecordAndSelectId,
} from "~/components/dbServices";

const questions = ref([]);
const supabase = useSupabaseClient();
const answers = ref([]);
const showModal = ref(false);

const routeTo = () => {
  navigateTo("/");
};

const filteredAnswers = (questionId) => {
  return answers.value.filter((answer) => answer.question_id === questionId);
};

const refreshData = async () => {
  try {
    questions.value = await fetchRecords(supabase, "questions");
    answers.value = await fetchRecords(supabase, "answers");
  } catch (error) {
    console.error("Error fetching records:", error);
  }
};

onMounted(refreshData);

const addQuestions = async ({ question, answer }) => {
  try {
    const id = await addRecordAndSelectId(supabase, "questions", question);
    await addAnwers(answer, id);
    await refreshData();
  } catch (error) {
    console.error("Error adding record:", error.message);
  }
};

const addAnwers = async (answer, id) => {
  const anwer_data = { text: answer, question_id: id };
  try {
    await addRecord(supabase, "answers", anwer_data);
  } catch (error) {
    console.error("Error adding record:", error.message);
  }
};
</script>

<style>
.start-from-top {
  align-items: flex-start;
  justify-content: flex-start;
}
</style>

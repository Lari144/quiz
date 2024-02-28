<template>
  <div class="font-base text-[#333] bg-dark min-h-screen flex flex-col">
    <header class="w-full flex justify-between items-start px-4 pt-2">
      <button @click="routeTo" class="text-white">Go back</button>
    </header>
    <div v-for="question in question"></div>
    <button
      class="bg-darker-grey rounded-lg flex flex-col items-center justify-center p-3 text-white text-center"
      @click="addQuestions"
      style="width: 90%; height: 100%"
    >
      +
    </button>
  </div>
</template>

<script setup>
import { addRecord } from "~/components/dbServices";

const questions = ref([]);
const answers = ref([]);

const routeTo = () => {
  navigateTo("/");
};

const refreshData = async () => {
  try {
    boxes.value = await fetchRecords(supabase, "questions");
  } catch (error) {
    console.error("Error fetching records:", error);
  }
};

const addAnwers = async (answer, question_id) => {
  try {
    const anwer_data = { text: answer, question_id: question_id };
    await addRecord(supabase, "answers", anwer_data);
  } catch (error) {
    console.error("Error adding record:", error.message);
  }
};

const addQuestions = async ({ question, question_id, answer }) => {
  try {
    const question_data = { text: question };
    await addRecord(supabase, "questions", question_data);
    await addAnwers(answer, question_id);
    await refreshData();
  } catch (error) {
    console.error("Error adding record:", error.message);
  }
};
</script>

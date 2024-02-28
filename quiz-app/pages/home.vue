<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
  />
  <div class="font-base text-[#333] bg-dark min-h-screen flex flex-col">
    <header class="w-full flex justify-between items-start px-4 pt-2">
      <button @click="routeTo" class="text-white">Go back</button>
    </header>
    <div
      v-for="(question, index) in questions"
      :key="index"
      class="bg-darker-grey rounded-lg flex flex-col items-center justify-center p-3 text-white text-center"
    >
      {{ question.text }}
      <button>
        <i class="fa fa-solid fa-pencil" style="color: white"></i>
      </button>
    </div>
    <div v-if="showModal">
      <Qa @update:showModal="showModal = $event" @submit="addQuestions" />
    </div>
    <button
      class="bg-darker-grey rounded-lg flex flex-col items-center justify-center p-3 text-white text-center"
      @click="showModal = true"
      style="width: 90%; height: 100%"
    >
      +
    </button>
  </div>
</template>

<script setup>
import { addRecord, fetchRecords } from "~/components/dbServices";

const questions = ref([]);
const supabase = useSupabaseClient();
const answers = ref([]);
const showModal = ref(false);

const routeTo = () => {
  navigateTo("/");
};

const refreshData = async () => {
  try {
    questions.value = await fetchRecords(supabase, "questions");
  } catch (error) {
    console.error("Error fetching records:", error);
  }
};

onMounted(refreshData);

const addAnwers = async (answer, question_id) => {
  try {
    const anwer_data = { text: answer, question_id: question_id };
    await addRecord(supabase, "answers", anwer_data);
  } catch (error) {
    console.error("Error adding record:", error.message);
  }
};

const addQuestions = async ({ question, answer }) => {
  try {
    const question_data = { text: question };
    await addRecord(supabase, "questions", question_data);
    await refreshData();
  } catch (error) {
    console.error("Error adding record:", error.message);
  }
};
</script>

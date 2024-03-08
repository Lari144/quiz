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
      <div
        @dblclick="toggleInput(question)"
        v-for="(question, index) in questions"
        :key="index"
        class="w-9/12 bg-darker-grey rounded-lg shadow-md p-3 mb-4 text-slate-100"
      >
        <button
          v-if="question.picture_url"
          @click="deletePicture(question.id)"
          class="float-right"
        >
          <i class="fa fa-solid fa-trash text-stone-800 hover:text-red-950"></i>
        </button>
        <div v-if="question.picture_url" class="image-container">
          <img :src="question.picture_url" alt="Uploaded Image" />
        </div>
        <input
          type="file"
          @change="addPicture($event, question.id)"
          ref="fileInput"
        />
        <button @click="deleteQA(question.id)" class="float-right">
          <i class="fa fa-solid fa-trash text-stone-800 hover:text-red-950"></i>
        </button>
        <div v-if="!question.showInput">
          {{ question.text }}
        </div>
        <div v-if="question.showInput">
          <input
            class="w-10/12 text-white p-2 bg-darker-grey border border-input-bg focus:border-dark-purple rounded-md"
            v-model="newQuestion"
            maxlength="50"
          />
          <button @click="updateQuestion(question, question.id)" class="ml-4">
            save
          </button>
        </div>
        <div
          @dblclick.stop="toggleInput(answer)"
          v-for="(answer, index) in filteredAnswers(question.id)"
          :key="index"
          class="mt-2 p-2 bg-input-bg rounded-md"
        >
          <div v-if="!answer.showInput">
            {{ answer.text }}
          </div>
          <div v-if="answer.showInput">
            <input
              class="w-10/12 text-white p-2 bg-input-bg border border-darker-grey focus:border-dark-purple rounded-md"
              v-model="newAnswer"
              maxlength="50"
            />
            <button @click="updateAnswer(answer, answer.id)" class="ml-4">
              save
            </button>
          </div>
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

<script setup lang="ts">
import {
  addRecord,
  fetchRecords,
  addRecordAndSelectId,
  fetchRecordsQuestions,
  updateQuestionAndAnswer,
  deleteRecord,
  updateQuestionWithPicture,
  addFile,
  fetchPublicUrl,
} from "~/components/dbServices";
import { useBoxStore } from "../store/box";

const { cardId } = useBoxStore();

const questions = ref([]);
const supabase = useSupabaseClient();
const answers = ref([]);
const showModal = ref(false);
const newQuestion = ref("");
const newAnswer = ref("");
const user = useSupabaseUser();
let fileInput = ref(null);

const toggleInput = (item) => {
  item.showInput = !item.showInput;
};

const routeTo = () => {
  navigateTo("/");
};

const filteredAnswers = (questionId) => {
  return answers.value.filter((answer) => answer.question_id === questionId);
};

const refreshData = async () => {
  try {
    questions.value = await fetchRecordsQuestions(supabase, cardId);
    answers.value = await fetchRecords(supabase, "answers");
  } catch (error) {
    console.error("Error fetching records:", error);
  }
};

onMounted(refreshData);

const deletePicture = async (question_id) => {
  try {
    await updateQuestionWithPicture(supabase, "questions", question_id, "");
    await refreshData();
  } catch (error) {
    console.error("Error uploading picture:", error.message);
  }
};

const addPicture = async (event, question_id) => {
  if (event.target.files.length > 0) {
    fileInput = event.target.files[0];
    try {
      await addFile(supabase, user.value?.id, fileInput);
      const url = await fetchPublicUrl(supabase, user.value?.id, fileInput);
      await updateQuestionWithPicture(
        supabase,
        "questions",
        question_id,
        `${url}`
      );
      await refreshData();
    } catch (error) {
      console.error("Error uploading picture:", error.message);
    }
  }
};

const addQuestions = async ({ question, answer }) => {
  try {
    const id = await addRecordAndSelectId(
      supabase,
      "questions",
      question,
      cardId
    );
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

const updateQuestion = async (question, id) => {
  try {
    await updateQuestionAndAnswer(supabase, "questions", id, newQuestion.value);
    await refreshData();
    toggleInput(question);
  } catch (error) {
    console.error("Error adding record:", error.message);
  }
};

const updateAnswer = async (answer, id) => {
  try {
    console.log(id, answer);
    await updateQuestionAndAnswer(supabase, "answers", id, newAnswer.value);
    await refreshData();
    toggleInput(answer);
  } catch (error) {
    console.error("Error adding record:", error.message);
  }
};

const deleteQA = async (question_id) => {
  try {
    const relatedAnswers = answers.value.filter(
      (answer) => answer.question_id === question_id
    );
    for (let answer of relatedAnswers) {
      await deleteRecord(supabase, "answers", answer.id);
    }
    await deleteRecord(supabase, "questions", question_id);
    await refreshData();
  } catch (error) {
    console.error("Error deleting record:", error.message);
  }
};
</script>

<style scoped>
.start-from-top {
  align-items: flex-start;
  justify-content: flex-start;
}
</style>

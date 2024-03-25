<template>
  <div
    v-if="questions.length > 0"
    class="flex flex-col items-center justify-center py-24"
  >
    <div class="flex flex-col items-center">
      <div v-if="currentQuestion.picture_url" class="flex justify-center mb-4">
        <img
          class="object-contain"
          style="max-height: 40%; max-width: 40%"
          :src="currentQuestion.picture_url"
          alt="Uploaded Image"
        />
      </div>
      <div class="flex flex-col items-center justify-center py-10 text-center">
        <div>{{ currentQuestion.public_url }}</div>
        <div class="text-4xl text-slate-200">{{ currentQuestion.text }}</div>
      </div>
      <div class="flex justify-center w-full px-4">
        <button
          v-for="(choice, index) in answers"
          :key="index"
          class="m-2 btn"
          @click="selectAnswer(choice)"
        >
          {{ choice.text }}
        </button>
      </div>
    </div>
  </div>
  <div v-else class="text-white text-center p-80 text-5xl">No cards yet</div>
</template>

<script setup lang="ts">
import {
  fetchRecordsTest,
  fetchRecordsQuestions,
  updateAnswer,
} from "~/components/dbServices";
import { useNuxtApp, navigateTo } from "#imports";
import { useBoxStore } from "../store/box";

const questions = ref([]);
const answers = ref([]);
const supabase = useSupabaseClient();
const currentIndex = ref(0);
const currentQuestion = ref({});
const currentAnswer = ref({});
const boxStore = useBoxStore();
const cardId = boxStore.cardId;

const fetchData = async () => {
  questions.value = await fetchRecordsQuestions(supabase, cardId);
  answers.value = await fetchRecordsTest(supabase, "answers");
  console.log(answers.value);
  filterQuestions();
};

const filterQuestions = () => {
  questions.value = questions.value.filter((q) =>
    answers.value.some((a) => a.question_id === q.id)
  );
  if (questions.value.length > 0) {
    updateCurrentQA();
  }
};

onMounted(fetchData);

const updateCurrentQA = () => {
  let question = questions.value[currentIndex.value];
  currentQuestion.value = { ...question, flipped: false };
  let answer = answers.value.find((a) => a.question_id === question.id);
  currentAnswer.value = answer || {};
};

const nextQuestion = () => {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value += 1;
    updateCurrentQA();
  } else {
    alert("Finished test");
    routeTo();
  }
};

const selectAnswer = async (choice) => {
  if (choice.text === currentAnswer.value.text) {
    useNuxtApp().$toast.success("Correct");
    await updateAnswer(supabase, "answers", currentAnswer.value.id, true);
    nextQuestion();
  } else {
    useNuxtApp().$toast.error("Incorrect, try again");
  }
};

const routeTo = () => {
  navigateTo("/");
};
</script>

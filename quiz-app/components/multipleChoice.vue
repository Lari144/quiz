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
          v-for="(choice, index) in randomAnswers"
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
  fetchRecords,
} from "~/components/dbServices";
import { useBoxStore } from "../store/box";

const supabase = useSupabaseClient();
const boxStore = useBoxStore();
const cardId = boxStore.cardId;
const questions = ref([]);
const answers = ref([]);
const currentIndex = ref(0);
const currentQuestion = ref({});
const currentAnswer = ref({});
let randomAnswers = ref([]);
const allQuestions = ref([]);

const fetchData = async () => {
  questions.value = await fetchRecordsQuestions(supabase, cardId);
  answers.value = await fetchRecordsTest(supabase, "answers");
  filterQuestions();
  randomAnswersAndCurrectAnswer();
};

const filterQuestions = () => {
  questions.value = questions.value.filter((q) =>
    answers.value.some((a) => a.question_id === q.id)
  );
  shuffleArray(questions.value);
  if (questions.value.length > 0) {
    updateCurrentQA();
  }
};

const randomAnswersAndCurrectAnswer = async () => {
  allQuestions.value = await fetchRecordsQuestions(supabase, cardId);
  const allAnswers = await fetchRecords(supabase, "answers");

  const filteredAnswers = allAnswers.filter((answer) =>
    allQuestions.value.some((question) => question.id === answer.question_id)
  );

  const filteredWithoutCurrent = filteredAnswers.filter(
    (answer) => answer.id !== currentAnswer.value.id
  );

  randomAnswers.value = filteredWithoutCurrent.slice(0, 3);
  randomAnswers.value.push(currentAnswer.value);
  shuffleArray(randomAnswers.value);
};

onMounted(fetchData);

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const updateCurrentQA = () => {
  if (currentIndex.value < questions.value.length) {
    const question = questions.value[currentIndex.value];
    currentQuestion.value = { ...question };
    const answer = answers.value.find((a) => a.question_id === question.id);
    currentAnswer.value = answer || {};
    randomAnswersAndCurrectAnswer();
  }
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

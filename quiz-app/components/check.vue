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
        <textarea
          class="textarea-base input-base text-white max-w-xs border-darker-grey focus:border-dark-purple overflow-hidden resize-none"
          placeholder="Enter the correct answer..."
          v-model="answer"
          style="height: 150px; width: 400px"
        ></textarea>
      </div>
    </div>
    <div class="text-white p-4">
      <button class="hover:text-gray-300" @click="checkAnswer()">check</button>
    </div>
  </div>
  <div v-else class="text-white text-center p-80 text-5xl">No cards yet</div>
</template>

<script setup lang="ts">
import {
  fetchRecords,
  fetchRecordsQuestions,
  updateAnswer,
} from "~/components/dbServices";
import { useBoxStore } from "../store/box";

const questions = ref([]);
const answers = ref([]);
const supabase = useSupabaseClient();
const currentIndex = ref(0);
const currentQuestion = ref({});
const currentAnswer = ref({});
const answer = ref("");
const { cardId } = useBoxStore();

const routeTo = () => {
  navigateTo("/");
};

const fetchData = async () => {
  console.log(cardId);
  questions.value = await fetchRecordsQuestions(supabase, cardId);
  answers.value = await fetchRecords(supabase, "answers");
  if (questions.value.length > 0) {
    updateCurrentQA();
  }
};

onMounted(fetchData);

const nextQuestion = () => {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value += 1;
    updateCurrentQA();
  }
};

const checkAnswer = async () => {
  if (answer.value === currentAnswer.value.text) {
    if (currentIndex.value === questions.value.length - 1) {
      alert("Finished test");
      routeTo();
    } else {
      useNuxtApp().$toast.success("Correct");
      setTimeout(() => {
        updateAnswer(supabase, "answers", currentAnswer.value.id);
        nextQuestion();
        answer.value = "";
      }, 1000);
    }
  } else {
    useNuxtApp().$toast.error("Incorrect, try again");
    answer.value = "";
  }
};

const updateCurrentQA = () => {
  let question = questions.value[currentIndex.value];
  currentQuestion.value = { ...question, flipped: false };
  let answer = answers.value.find(
    (answer) => answer.question_id === question.id
  );
  currentAnswer.value = answer || {};
};
</script>

<style scoped>
.textarea-base {
  background: none;
  padding: 10px;
  display: block;
}
</style>

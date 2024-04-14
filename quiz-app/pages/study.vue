<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
  />
  <div
    class="font-base text-[#333] bg-dark min-h-screen flex flex-col start-from-top"
  >
    <header class="w-full flex justify-between items-start px-4 pt-2">
      <button
        @click="routeTo"
        class="text-white hover:text-gray-300 font-semibold text-xl"
      >
        Go back
      </button>
    </header>
    <div class="flex-grow w-full p-4">
      <div
        v-if="questions.length > 0"
        class="flex flex-col items-center justify-center py-36"
      >
        <div
          class="card rounded-xl"
          :class="{ flipped: currentQuestion?.flipped }"
          @click="flipCard"
        >
          <div class="front flex flex-col">
            <div v-if="currentQuestion?.picture_url">
              <img
                class="w-full mb-4"
                :src="currentQuestion.picture_url"
                alt="Uploaded Image"
              />
            </div>
            <div>
              {{ currentQuestion?.text }}
            </div>
          </div>
          <div class="back">
            {{ currentAnswer?.text }}
          </div>
        </div>
        <div class="navigation text-white">
          <button class="hover:text-gray-300" @click="previousQuestion">
            ❮ Prev
          </button>
          <button class="hover:text-gray-300" @click="nextQuestion">
            Next ❯
          </button>
        </div>
      </div>
      <div v-else class="text-white text-center p-80 text-5xl">
        No cards yet
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { fetchRecords, fetchRecordsQuestions } from "~/components/dbServices";
import { useBoxStore } from "../store/box";
import type { Question } from "../types/question";
import type { Answer } from "../types/answer";

const questions = ref<Question[]>([]);
const answers = ref<Answer[]>([]);
const supabase = useSupabaseClient();
const currentIndex = ref(0);
const currentQuestion = ref<Question | null>(null);
const currentAnswer = ref<Answer | null>(null);
const { cardId } = useBoxStore();

const routeTo = () => {
  navigateTo("/");
};

const fetchData = async () => {
  questions.value = await fetchRecordsQuestions(supabase, cardId);
  answers.value = await fetchRecords(supabase, "answers");
  if (questions.value.length > 0) {
    updateCurrentQA();
  }
};

onMounted(fetchData);

const flipCard = () => {
  if (currentQuestion.value) {
    currentQuestion.value.flipped = !currentQuestion.value.flipped;
  }
};

const nextQuestion = () => {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value += 1;
    updateCurrentQA();
  }
};

const previousQuestion = () => {
  if (currentIndex.value > 0) {
    currentIndex.value -= 1;
    updateCurrentQA();
  }
};

const updateCurrentQA = () => {
  let question = questions.value[currentIndex.value];
  console.log(question);
  currentQuestion.value = { ...question, flipped: false };
  let answer = answers.value.find(
    (answer) => answer.question_id === question.id
  );
  currentAnswer.value = answer! || {};
};
</script>

<style scoped>
.card {
  width: 600px;
  height: 400px;
  background-color: #2c2c2c;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.card.flipped {
  transform: rotateY(180deg);
}

.front,
.back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  color: white;
  font-size: 20px;
  padding: 20px;
}

.back {
  background: #555555;
  transform: rotateY(180deg);
}

.navigation button {
  margin: 10px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
}
</style>

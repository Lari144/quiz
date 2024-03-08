<template>
  <div class="questions-container">
    <div v-for="question in questions" :key="question.id" class="question-item">
      <div class="title">{{ question.text }}</div>
      <draggable
        class="answers-slot"
        :list="filteredAnswers(question.id)"
        group="answers"
        item-key="id"
      >
        <template #item="{ element: answer }">
          <div class="answer">{{ answer.text }}</div>
        </template>
        <div v-if="!filteredAnswers(question.id).length" class="placeholder">
          Drop an answer here
        </div>
      </draggable>
    </div>
  </div>
  <div v-for="question in questions" :key="question.id" class="question-item">
    <draggable
      class="answers-slot"
      :list="filteredAnswers(question.id)"
      group="answers"
      item-key="id"
    >
      <template #item="{ element: answer }">
        <div class="global-answer-item">{{ answer.text }}</div>
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
import { fetchRecordsQuestions, fetchRecords } from "./dbServices";
import { useBoxStore } from "../store/box";

const questions = ref([]);
const answers = ref([]);
const supabase = useSupabaseClient();
const { cardId } = useBoxStore();

const filteredAnswers = (questionId) => {
  return answers.value.filter((answer) => answer.question_id === questionId);
};

const fetchData = async () => {
  questions.value = await fetchRecordsQuestions(supabase, cardId);
  answers.value = await fetchRecords(supabase, "answers");
};

onMounted(fetchData);
</script>

<template>
  <div class="w-full bg-gray-200 rounded-full dark:bg-gray-700">
    <div
      :style="{ width: progress + '%' }"
      class="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 rounded-full"
    >
      {{ progress }}%
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref } from "vue";
import {
  fetchRecords,
  fetchRecordsQuestions,
  fetchCorrectAnswers,
} from "~/components/dbServices";

const props = defineProps({ card_id: Number });
const supabase = useSupabaseClient();
const progress = ref(0);

const updateProgress = async () => {
  const questions = await fetchRecordsQuestions(supabase, props.card_id);

  const allAnswers = await fetchRecords(supabase, "answers");
  const correct_answers = await fetchCorrectAnswers(supabase, "answers");
  const cardAnswers = allAnswers.filter((answer) =>
    questions.some((question) => question.id === answer.question_id)
  );

  const correctAnswersCount = correct_answers.length;
  const totalAnswersCount = cardAnswers.length;

  const calculatedProgress =
    totalAnswersCount > 0 ? (correctAnswersCount / totalAnswersCount) * 100 : 0;
  progress.value = calculatedProgress;
};

onMounted(() => {
  updateProgress();
});
</script>

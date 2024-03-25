<template>
  <div class="w-full bg-dark-bg rounded-full">
    <div
      :style="{ width: progress + '%' }"
      class="bg-very-light-purple text-xs font-medium text-blue-100 text-center p-0.5 rounded-full"
    >
      {{ progress }}%
    </div>
  </div>
</template>

<script setup lang="ts">
import { fetchRecords, fetchRecordsQuestions } from "~/components/dbServices";

const props = defineProps({ card_id: Number });
const supabase = useSupabaseClient();
const progress = ref(0);

const updateProgress = async () => {
  const questions = await fetchRecordsQuestions(supabase, props.card_id);
  const allAnswers = await fetchRecords(supabase, "answers");

  const cardAnswers = allAnswers.filter((answer) =>
    questions.some((question) => question.id === answer.question_id)
  );

  let correctAnsweredQuestions = 0;
  questions.forEach((question) => {
    if (
      cardAnswers.some(
        (answer) => answer.question_id === question.id && answer.is_correct
      )
    ) {
      correctAnsweredQuestions++;
    }
  });

  const totalQuestionsCount = questions.length;
  const calculatedProgress =
    totalQuestionsCount > 0
      ? Math.round((correctAnsweredQuestions / totalQuestionsCount) * 100)
      : 0;
  progress.value = calculatedProgress;
};

onMounted(() => {
  updateProgress();
});
</script>

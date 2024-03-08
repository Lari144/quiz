<template>
  <draggable v-model="questions" handle=".handle">
    <template #item="{ element: question }">
      <div class="item">
        <div class="title">{{ question.title }}</div>
        <div class="handle">Sort</div>
      </div>
    </template>
  </draggable>
</template>

<script setup lang="ts">
import { fetchRecordsQuestions, fetchRecords } from "./dbServices";
import { useBoxStore } from "../store/box";

const questions = ref([]);
const answers = ref([]);
const supabase = useSupabaseClient();
const { cardId } = useBoxStore();

const fetchData = async () => {
  questions.value = await fetchRecordsQuestions(supabase, cardId);
  answers.value = await fetchRecords(supabase, "answers");
};

onMounted(fetchData);
</script>

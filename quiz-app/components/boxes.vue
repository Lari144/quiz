<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
  />
  <div class="flex flex-wrap gap-4 p-4">
    <div
      v-for="(box, index) in boxes"
      :key="index"
      class="w-80 h-64 bg-darker-grey rounded-lg flex flex-col justify-between p-2"
    >
      <div class="flex justify-between" style="font-size: x-large">
        <button @click="deleteCard(box.id)">
          <i
            v-if="!box.showInput"
            style="margin-left: 5px"
            class="fa fa-solid fa-trash text-stone-800 hover:text-red-950"
          ></i>
          <div
            class="text-gray-300 text-lg cursor-text"
            v-if="box.showInput"
            style="margin-left: 5px; text-decoration: underline"
          >
            Edit Mode
          </div>
        </button>
        <div>
          <button @click="routeTo(box.id, '/home')">
            <i
              style="margin-right: 6px"
              v-if="!box.showInput"
              class="fa fa-solid fa-pencil text-slate-100 hover:text-gray-300"
            ></i>
          </button>
          <button
            class="text-gray-300 text-lg hover:text-gray-500"
            @click="toggleInput(box)"
            v-if="box.showInput"
          >
            cancel
          </button>
        </div>
      </div>
      <div>
        <div
          v-if="!box.showInput"
          @dblclick="toggleInput(box)"
          class="flex justify-center"
          style="color: white; font-size: xx-large"
        >
          {{ box.title }}
        </div>
        <input
          class="text-white input-base border-darker-grey focus:border-dark-purple"
          v-if="box.showInput"
          v-model="newCardTitle"
          type="text"
          style="font-size: large"
        />
      </div>
      <div class="flex justify-end" style="font-size: x-large">
        <Progress :card_id="box.id" />
        <button
          @click="routeTo(box.id, '/start')"
          v-if="!box.showInput"
          class="mr-4 text-white hover:text-gray-300"
        >
          <i class="fa fa-solid fa-play"></i>
        </button>
        <button class="mr-4 text-white hover:text-gray-300">
          <i
            style="margin-right: -5px"
            @click="routeTo(box.id, '/study')"
            v-if="!box.showInput"
            class="fa fa-solid fa-graduation-cap"
          ></i>
        </button>
        <button
          class="text-gray-300 text-xl hover:text-white"
          @click="updateCard(box, box.id)"
          v-if="box.showInput"
        >
          save
        </button>
      </div>
    </div>
    <div
      @click="showModal = true"
      class="cursor-pointer flex justify-center items-center w-80 h-64 bg-input-bg rounded-lg text-4xl text-mid-purple hover:text-dark-purple hover:bg-darker-grey transition-colors"
    >
      +
    </div>
  </div>
  <div v-if="showModal">
    <Modal @update:showModal="showModal = $event" @submit="addCard" />
  </div>
</template>

<script setup lang="ts">
import {
  addRecord,
  fetchRecordsCards,
  updateRecord,
  deleteCards,
} from "./dbServices";
import { useBoxStore } from "../store/box";
import Progress from "./progress.vue";

const boxes = ref([]);
const supabase = useSupabaseClient();
const showModal = ref(false);
const newCardTitle = ref("");
const user = useSupabaseUser();
const store = useBoxStore();

const refreshData = async () => {
  try {
    boxes.value = await fetchRecordsCards(supabase, "cards", user.value?.id);
  } catch (error) {
    console.error("Error fetching records:", error);
  }
};

onMounted(refreshData);

const addCard = async ({ name, category }) => {
  const tableName = "cards";
  const data = { title: name, user: user.value?.id };
  try {
    await addRecord(supabase, tableName, data);
    await refreshData();
  } catch (error) {
    console.error("Error adding record:", error.message);
  }
};

const deleteCard = async (index) => {
  try {
    await deleteCards(supabase, index);
    await refreshData();
  } catch (error) {
    console.error("Error deleting card:", error.message);
  }
};

const updateCard = async (box, index) => {
  const tablename = "cards";
  try {
    console.log(box, newCardTitle);
    await updateRecord(supabase, tablename, index, newCardTitle.value);
    toggleInput(box);
    await refreshData();
  } catch (error) {
    console.error("Error deleting record:", error.message);
  }
};

const routeTo = (cardId, path) => {
  store.setCardId(cardId);
  navigateTo(path);
};

const toggleInput = (box) => {
  box.showInput = !box.showInput;
};
</script>

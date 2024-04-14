<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
  />
  <link rel="stylesheet" href="https://cdn.lordicon.com/lordicon.js" />
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
      <div class="flex items-center justify-end space-x-5">
        <Progress v-if="!box.showInput" :card_id="box.id" class="flex-grow" />
        <button
          @click="routeTo(box.id, '/start')"
          v-if="!box.showInput"
          class="text-xl text-white hover:text-gray-300"
        >
          TEST
        </button>
        <button
          @click="routeTo(box.id, '/study')"
          v-if="!box.showInput"
          style="margin-right: 5px"
          class="text-xl text-white hover:text-gray-300"
        >
          <i class="fa fa-solid fa-graduation-cap"></i>
        </button>
        <button
          @click="updateCard(box, box.id)"
          v-if="box.showInput"
          class="text-xl text-gray-300 hover:text-white"
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
  fetchRecords,
} from "./dbServices";
import { useBoxStore } from "../store/box";
import Progress from "./progress.vue";
import type { Category } from "../types/category";
import type { Box } from "../types/box";

const boxes = ref<Box[]>([]);
const categories = ref<Category[]>([]);
const supabase = useSupabaseClient();
const showModal = ref(false);
const newCardTitle = ref("");
const user = useSupabaseUser();
const store = useBoxStore();
let searchDebounceTimer: ReturnType<typeof setTimeout>;

const props = defineProps({ searchQuery: String, searchType: String });

const refreshData = async () => {
  if (props.searchQuery) {
    const searchQueryLowercase = props.searchQuery.toLowerCase();

    if (props.searchType === "title") {
      boxes.value = boxes.value.filter((box) =>
        box.title.toLowerCase().includes(searchQueryLowercase)
      );
    } else if (props.searchType === "category") {
      const matchingCategories = categories.value.filter((c) =>
        c.name.toLowerCase().includes(searchQueryLowercase)
      );
      boxes.value = boxes.value.filter((box) =>
        matchingCategories.some((category) => category.id === box.category_id)
      );
    }
  } else {
    await fetchAllData();
  }
};

const fetchAllData = async () => {
  try {
    boxes.value = await fetchRecordsCards(supabase, "cards", user.value.id);
    categories.value = await fetchRecords(supabase, "categories");
  } catch (error) {
    console.error("Error fetching records:", error);
  }
};

onMounted(() => {
  fetchAllData();
});

watch([() => props.searchQuery, props.searchType], () => {
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => {
    refreshData();
  }, 500);
});

const addCard = async ({ title, category }: Box) => {
  const tableName = "cards";
  const category_ = categories.value.find((c) => c.name === category);
  const data = {
    title: title,
    user: user.value?.id,
    category_id: category_?.id,
  };
  try {
    await addRecord(supabase, tableName, data);
    await refreshData();
  } catch (error) {
    console.error("Error adding record:", error.message);
  }
};

const deleteCard = async (index: number) => {
  try {
    await deleteCards(supabase, index);
    await refreshData();
  } catch (error) {
    console.error("Error deleting card:", error.message);
  }
};

const updateCard = async (box: Box, index: number) => {
  const tablename = "cards";
  try {
    await updateRecord(supabase, tablename, index, newCardTitle.value);
    toggleInput(box);
    await refreshData();
  } catch (error) {
    console.error("Error deleting record:", error.message);
  }
};

const routeTo = (cardId: number, path: string) => {
  store.setCardId(cardId);
  navigateTo(path);
};

const toggleInput = (box: any) => {
  box.showInput = !box.showInput;
};
</script>

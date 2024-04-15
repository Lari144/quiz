<template>
  <div class="flex justify-between items-center gap-4 p-4">
    <div>
      <button
        @click="showModal = true"
        class="btn bg-input-bg hover:bg-darker-grey text-white"
      >
        Create a category
      </button>
    </div>
    <div class="flex gap-4 items-center">
      <select
        v-model="searchType"
        @change="$emit('search-type-change', searchType)"
        class="bg-input-bg text-white placeholder-gray-300 focus:outline-none rounded-full p-2.5"
      >
        <option value="title">Title</option>
        <option value="category">Category</option>
      </select>
      <div
        class="relative flex items-center bg-input-bg text-white rounded-full"
      >
        <i class="fa fa-search absolute ml-4 text-white"></i>
        <input
          v-model="input"
          type="text"
          @input="$emit('input-value', input)"
          class="text-sm pl-10 py-3 w-full bg-input-bg text-white placeholder-gray-300 focus:outline-none rounded-full"
          placeholder="Search for ..."
        />
      </div>
    </div>
  </div>
  <div v-if="showModal">
    <ModalCategory
      @update:showModal="showModal = $event"
      @submit="addCategory"
    />
  </div>
</template>

<script setup lang="ts">
import type { Category } from "~/types/category";
import { addRecord } from "./dbServices";

const searchType = ref("");
const emit = defineEmits(["input-value", "search-type-change"]);
const input = ref("");
const showModal = ref(false);
const supabase = useSupabaseClient();

const addCategory = async ({ name, description }: Category) => {
  const tableName = "categories";
  const data = { name: name, description: description };
  try {
    await addRecord(supabase, tableName, data);
  } catch (error) {
    console.error("Error adding record:", error);
  }
};
</script>

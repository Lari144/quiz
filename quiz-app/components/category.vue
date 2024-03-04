<template>
  <div
    style="
      color: rgb(255, 255, 255);
      width: 200px;
      display: flex;
      justify-content: flex-start;
      margin-left: 15px;
    "
  >
    <button
      @click="showModal = true"
      class="btn bg-input-bg hover:bg-darker-grey"
    >
      Create a category
    </button>
  </div>
  <div v-if="showModal">
    <ModalCategory
      @update:showModal="showModal = $event"
      @submit="addCategory"
    />
  </div>
</template>

<script setup lang="ts">
import { addRecord } from "./dbServices";

const showModal = ref(false);
const supabase = useSupabaseClient();

const addCategory = async ({ name, description }) => {
  const tableName = "categories";
  const data = { name: name, description: description };
  try {
    await addRecord(supabase, tableName, data);
  } catch (error) {
    console.error("Error adding record:", error.message);
  }
};
</script>

<template>
  <head>
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
    />
  </head>
  <ClientOnly>
    <div class="p-12">
      <div class="flex flex-wrap gap-4">
        <div
          @click="addCard"
          class="cursor-pointer flex justify-center items-center w-80 h-64 bg-input-bg rounded-lg text-4xl text-mid-purple hover:text-dark-purple hover:bg-darker-grey transition-colors"
        >
          +
        </div>
        <div
          v-for="(box, index) in boxes"
          :key="index"
          class="w-80 h-64 bg-darker-grey rounded-lg flex flex-col justify-between p-3"
        >
          <div class="flex justify-between" style="font-size: x-large">
            <button>
              <i class="fa fa-solid fa-trash" style="color: #b51313"></i>
            </button>
            <button>
              <i class="fa fa-solid fa-pencil" style="color: white"></i>
            </button>
          </div>
          <div
            class="flex justify-center"
            style="color: white; font-size: xx-large"
          >
            {{ box.title }}
          </div>
          <div class="flex justify-end" style="font-size: x-large">
            <button class="mr-4">
              <i class="fa fa-solid fa-play" style="color: white"></i>
            </button>
            <button>
              <i class="fa fa-solid fa-graduation-cap" style="color: white"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { addRecord, fetchRecords } from "./dbServices";

const boxes = ref([]);
const supabase = useSupabaseClient();

const refreshData = async () => {
  try {
    boxes.value = await fetchRecords(supabase, "cards");
  } catch (error) {
    console.error("Error fetching records:", error);
  }
};

onMounted(refreshData);

const addCard = async () => {
  const tableName = "cards";
  const data = { title: "New Record Name" };
  try {
    await addRecord(supabase, tableName, data);
    await refreshData();
  } catch (error) {
    console.error("Error adding record:", error.message);
  }
};
</script>

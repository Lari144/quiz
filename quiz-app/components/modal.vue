<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center"
  >
    <div
      class="bg-input-bg p-5 rounded-lg flex flex-col justify-between"
      style="width: 25rem; height: 17rem"
    >
      <form class="flex flex-col justify-between h-full">
        <div>
          <div class="text-white">
            <label class="p-1">Card Name:</label>
            <input
              v-model="title"
              type="text"
              class="text-white input-base border-darker-grey focus:border-dark-purple"
            />
          </div>
          <div class="text-white mt-4">
            <label class="p-1">Category:</label>
            <select
              v-model="category"
              class="input-base border-darker-grey focus:border-dark-purple"
            >
              <option disabled value="">Select one category</option>
              <option v-for="item in categories">{{ item.name }}</option>
            </select>
          </div>
        </div>
        <div class="mt-4 flex justify-end">
          <button
            type="button"
            @click="submit"
            class="btn btn-purple"
            style="width: 100px"
          >
            Add Card
          </button>
          <button type="button" @click="closeModal" class="ml-2 text-slate-300">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { fetchRecordsCategorie } from "./dbServices";
const emits = defineEmits(["update:showModal", "submit"]);

const title = ref("");
const category = ref("");
const categories = ref([]);
const supabase = useSupabaseClient();

onMounted(() => {
  fetchCategories();
});

const closeModal = () => {
  emits("update:showModal", false);
};

const submit = () => {
  emits("submit", { name: title.value, category: category.value });
  closeModal();
};

const fetchCategories = async () => {
  try {
    categories.value = await fetchRecordsCategorie(supabase, "categories");
  } catch (error) {
    console.error("Error fetching records:", error);
  }
};
</script>

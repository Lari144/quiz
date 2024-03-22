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
            <label class="p-1">Add categories:</label>
            <input
              style="margin-bottom: 15px"
              v-model="category"
              type="text"
              class="text-white input-base border-darker-grey focus:border-dark-purple"
            />
            <div>
              <label class="p-1">Description:</label>
              <input
                v-model="description"
                type="text"
                class="text-white input-base border-darker-grey focus:border-dark-purple"
              />
            </div>
          </div>
        </div>
        <div class="mt-4 flex justify-end">
          <button
            type="button"
            @click="submit"
            class="btn btn-purple"
            style="width: 100px"
          >
            Add
          </button>
          <button
            type="button"
            @click="closeModal"
            class="ml-2 text-slate-300 hover:text-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
const emits = defineEmits(["update:showModal", "submit"]);

const category = ref("");
const description = ref("");

const closeModal = () => {
  emits("update:showModal", false);
};

const submit = () => {
  emits("submit", { name: category.value, description: description.value });
  closeModal();
};
</script>

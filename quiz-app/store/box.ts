import { defineStore } from "pinia";

export const useBoxStore = defineStore("box", {
  state: () => ({
    cardId: null,
  }),
  actions: {
    setCardId(id) {
      this.cardId = id;
    },
  },
});

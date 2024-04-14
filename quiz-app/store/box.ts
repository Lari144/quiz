import { defineStore } from "pinia";

export const useBoxStore = defineStore("box", {
  state: () => ({
    cardId: 0,
  }),
  actions: {
    setCardId(id: number) {
      this.cardId = id;
    },
  },
});

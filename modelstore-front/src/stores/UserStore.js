import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    token: null,
    userData: null,
    cart: []
  }),
  persist: true,
});
import { defineStore } from "pinia";
import NetworkHelper from "@/utils/networkHelper";

export const useCounterStore = defineStore({
  id: "counter",
  state: () => ({
    counter: 0,
    users: [],
  }),
  getters: {
    count: state => state.counter,
    users: state => state.users,
    doubleCount: (state) => state.counter * 2,
  },
  actions: {
    increment() {
      this.counter++;
    },
    async getUsers() {
      const api = new NetworkHelper();
      const users = await api.get<any[]>("users");
      users.forEach(u => this.users.push(u))
    }
  },
});

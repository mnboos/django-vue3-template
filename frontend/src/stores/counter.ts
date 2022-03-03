import { defineStore } from "pinia";
import NetworkHelper from "@/utils/networkHelper";
import { Notify } from "quasar";
import { HTTPError } from "ky";

export type User = {
    username: string;
};

export type State = {
    counter: number;
    users: User[];
};

export const useCounterStore = defineStore({
    id: "counter",
    state: () =>
        ({
            counter: 0,
            users: [],
        } as State),
    getters: {
        count: state => state.counter,
        doubleCount: state => state.counter * 2,
    },
    actions: {
        increment() {
            this.counter++;
        },
        async getUsers() {
            const api = new NetworkHelper();
            try {
                const users = await api.get<User[]>("users");
                users.forEach(u => this.users.push(u));
            } catch (err) {
                console.error(err);
                if (err instanceof HTTPError) {
                    Notify.create({ message: `HTTP Error: ${err.message}`, type: "negative" });
                }
            }
        },
    },
});

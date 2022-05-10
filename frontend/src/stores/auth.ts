import { defineStore } from "pinia";
import NetworkHelper from "@/utils/networkHelper";

const api = new NetworkHelper();

export type State = {
    isAuthenticated: boolean;
    user: null | { username: string };
};

export const useAuthStore = defineStore({
    id: "auth",
    state: (): State => ({
        isAuthenticated: false,
        user: null,
    }),
    getters: {
        // isAuthenticated: state => state._isAuthenticated,
    },
    actions: {
        async login(username: string, password: string) {
            try {
                const res = await api.post<{ success: boolean; user: { username: string } }>("auth/login", {
                    username,
                    password,
                });

                console.log("login: ", res);
                if (res.success) {
                    this.user = res.user;
                }
                // this.$patch({ isAuthenticated: res.success });
                this.isAuthenticated = res.success;
            } catch (err) {
                console.error(err);
                this.isAuthenticated = false;
                throw err;
            }
        },
        async logout() {
            try {
                await api.post("auth/logout", null, false);
                this.isAuthenticated = false;
            } catch (err) {
                console.error(err);
                throw err;
            }
        }
    },
});

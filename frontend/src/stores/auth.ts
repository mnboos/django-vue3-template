import { defineStore } from "pinia";
import NetworkHelper from "@/utils/networkHelper";

const api = new NetworkHelper();

export type State = {
    isAuthenticated: boolean;
    user: null | { username: string };
    isInitialized: boolean;
};

export const useAuthStore = defineStore({
    id: "auth",
    state: (): State => ({
        isAuthenticated: false,
        user: null,
        isInitialized: false,
    }),
    getters: {
        // isAuthenticated: state => state._isAuthenticated,
    },
    actions: {
        async login(username: string, password: string) {
            try {
                const res = await api.postSafe<{ user: { username: string }; firstLogin: boolean }>("auth/login", {
                    username,
                    password,
                });

                if (res) {
                    this.user = res.user;
                    this.isAuthenticated = true;
                } else {
                    this.user = null;
                    this.isAuthenticated = false;
                }
            } catch (err) {
                this.isAuthenticated = false;
            }
            return this.isAuthenticated;
        },
        async logout() {
            try {
                await api.post("auth/logout", null);
                this.isAuthenticated = false;
            } catch (err) {
                console.error(err);
                throw err;
            }
        },
        /**
         * Tries to get the currently authenticated user.
         * If the user isn't authenticated, the call fails with status 401
         */
        async getCurrentUser() {
            try {
                this.user = await api.get("users/current", null, { timeout: 2000 });
                this.isAuthenticated = true;
            } catch (err) {
                this.isAuthenticated = false;
            }
        },
        async initialize() {
            await this.getCurrentUser();
            this.isInitialized = true;
        },
    },
});

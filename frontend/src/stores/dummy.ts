import { defineStore } from "pinia";
import NetworkHelper from "@/utils/networkHelper";
import { Notify } from "quasar";
import { HTTPError } from "ky";

const api = new NetworkHelper();

export type State = {
    foo: string;
};

export const useDummyStore = defineStore({
    id: "dummy",
    state: (): State => ({
        foo: "bar",
    }),
    getters: {
        // isAuthenticated: state => state._isAuthenticated,
    },
    actions: {
        async undetailedPost() {
            try {
                await api.post("dummy/undetailed_post", { foo: "bar" });
            } catch (err) {
                console.error(err);
                if (err instanceof HTTPError) {
                    Notify.create({ message: `undetailed_post failed: ${err.message}`, type: "negative" });
                }
            }
        },
    },
});

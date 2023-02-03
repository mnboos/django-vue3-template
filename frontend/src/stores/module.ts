import { defineStore } from "pinia";
import NetworkHelper from "@/utils/networkHelper";
import type { Module } from "@/stores/interfaces";

export type State = {
    modules: Module[];
};

const api = new NetworkHelper();

export const useModuleDefinitionStore = defineStore({
    id: "moduleDefinitions",
    state: (): State => ({
        modules: [],
    }),
    getters: {},
    actions: {
        async fetchModules(force = false) {
            if (force || !this.modules.length) {
                this.modules = (await api.getSafe<Module[]>("modules")) || [];
            }
        },
    },
});

import { defineStore } from "pinia";
import NetworkHelper from "@/utils/networkHelper";
import type { Pipeline, PipelineModule } from "@/stores/interfaces";

export type State = {
    pipelines: Pipeline[];
    selectedPipelineId: number | null;
    pipelineModules: PipelineModule[];
    runningPipelines: Set<number>;
    pipelineResults: { [key: number]: object };
    failedModules: { [key: number]: object };
    selectedModuleId: number | null;
};

const api = new NetworkHelper();

export const usePipelineStore = defineStore({
    id: "pipeline",
    state: (): State => ({
        pipelines: [],
        selectedPipelineId: null,
        pipelineModules: [],
        runningPipelines: new Set<number>(),
        pipelineResults: {},
        failedModules: {},
        selectedModuleId: null,
    }),
    getters: {
        selectedPipeline: state => state.pipelines.find(p => p.id === state.selectedPipelineId),
    },
    actions: {
        async fetchPipelines(force = false) {
            if (force || !this.pipelines.length) {
                this.pipelines = (await api.getSafe<Pipeline[]>("pipelines")) || [];
            }
        },
        async fetchPipelineModules(pipelineId: number) {
            this.pipelineModules = await api.get<PipelineModule[]>(`pipelines/${pipelineId}/modules`);
        },
        async addModule(moduleId: number): Promise<PipelineModule | null> {
            let createdModule: PipelineModule | null = null;
            if (this.selectedPipelineId) {
                createdModule = await api.postSafe<PipelineModule>("pipelinemodules", {
                    pipeline: this.selectedPipelineId,
                    module_id: moduleId,
                    parents: [39],
                });
                if (createdModule) {
                    await this.fetchPipelineModules(this.selectedPipelineId);
                }
            }
            return createdModule;
        },
        async updateModule(id: number, config: object) {
            const updatedModule = await api.patch<PipelineModule>(`pipelinemodules/${id}`, {
                id,
                config: JSON.stringify(config),
            });
            if (updatedModule) {
                const modules = this.pipelineModules.filter(m => m.id !== id);
                modules.push(updatedModule);
                this.pipelineModules = modules;
            }
        },
        async fetchModuleResultPage(moduleId: number, pagingOptions: object) {
            await this.pollPipeline(moduleId, false, pagingOptions);
        },
        async pollPipeline(moduleId: number, fullReload: boolean, pagingOptions: object) {
            if (this.selectedPipelineId) {
                try {
                    // todo: refactor to allow refreshing the results of a single module
                    const results: object = await api.get(`pipelines/${this.selectedPipelineId}/result`, {
                        moduleId,
                        fullReload,
                        ...pagingOptions,
                    });
                    this.pipelineResults = { ...this.pipelineResults, ...results };

                    // commit(c.mutations.addFailedModule, res.firstFailedModule);

                    if (this.pipelineModules.length === 1) {
                        this.runningPipelines.delete(this.selectedPipelineId);
                    }
                } catch (err) {
                    console.warn("Pipeline polling failed: ", err);
                    this.runningPipelines.delete(this.selectedPipelineId);
                }
            }
        },
    },
});

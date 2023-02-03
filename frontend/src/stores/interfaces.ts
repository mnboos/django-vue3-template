export interface Pipeline {
    id: number;
    name: string;
    resultsByModuleId: Record<number, unknown>;
    layout: { [key: number]: [number, number] };
}

export interface Module {
    module_id: string;
    name: string;
    group_name: string;
    description: string;
    nrAllowedInputs: null | number;
    hasOutput: boolean;
}

export interface PipelineModule {
    id: number;
    pipeline: number;
    config: object;
    module_id: string;
    children: number[];
    parents: number[];
}

export interface Snapshot {
    created_at: Date;
    data: string;
    pipeline: number;
    name: string;
    id: number;
}

export interface ServerMessage {
    module: number;
    type: string;
    msg: unknown;
}

export interface Schedule {
    last_run_at: string | null;
    total_run_count: number;
    expires: Date | null;
    enabled: boolean;
    crontab: string;
}

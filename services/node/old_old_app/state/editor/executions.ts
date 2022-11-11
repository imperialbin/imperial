import { atomWithStorage } from "jotai/utils";

export const executionsState = atomWithStorage<any[]>("executions", []);

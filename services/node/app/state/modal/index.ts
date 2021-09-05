import { atom } from "jotai";
import { modals } from "./modals";

type ActiveModal = [keyof typeof modals | null, unknown];

export const activeModal = atom<ActiveModal>([null, null]);

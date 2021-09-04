import { atom } from "jotai";
import { modals } from "./modals";

export const atomActiveModal = atom<keyof typeof modals | null>(null);

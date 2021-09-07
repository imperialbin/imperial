import { atom } from "jotai";
import { DocumentEditor } from "../../types";
import { modals } from "./modals";

type ActiveModal = [keyof typeof modals | null, unknown];

export const activeModal = atom<ActiveModal>([null, null]);
export const documentEditors = atom<Array<DocumentEditor>>([]);

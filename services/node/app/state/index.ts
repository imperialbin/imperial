import { editingState, languageState } from "./editor";
import { activeModal, documentEditors } from "./modal";

export default {
  editor: {
    languageState,
    editingState,
  },
  modal: {
    activeModal,
    documentEditors,
  },
};

import { AnyAction } from "redux";

export interface EditorState {
  readOnly: boolean;
  language: string;
}

const initial: EditorState = {
  readOnly: false,
  language: "plaintext",
};

type EditorActions =
  | {
      type: "SET_READONLY";
      payload: boolean;
    }
  | {
      type: "SET_LANGUAGE";
      payload: string; // todo: strictly type this
    };

const editor = (state: EditorState = initial, action: EditorActions) => {
  switch (action.type) {
    case "SET_READONLY":
      return { ...state, readOnly: action.payload };
    case "SET_LANGUAGE":
      return { ...state, language: action.payload };

    default:
      return state;
  }
};

export default editor;

export interface EditorState {
  readOnly: boolean;
  language: string;
  forked_content?: string;
}

const initial: EditorState = {
  // only camalcase because thats our monaco wants it
  readOnly: false,
  language: "auto",
  forked_content: undefined,
};

type EditorActions =
  | {
      type: "SET_READONLY";
      payload: boolean;
    }
  | {
      type: "SET_LANGUAGE";
      payload: string; // todo: strictly type this
    }
  | {
      type: "SET_FORKED_CONTENT";
      payload: string;
    };

const editor = (state: EditorState = initial, action: EditorActions) => {
  switch (action.type) {
    case "SET_READONLY":
      return { ...state, readOnly: action.payload };
    case "SET_LANGUAGE":
      return { ...state, language: action.payload };

    case "SET_FORKED_CONTENT":
      return { ...state, forked_content: action.payload };

    default:
      return state;
  }
};

export default editor;

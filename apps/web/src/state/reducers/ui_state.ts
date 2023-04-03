import { User } from "@web/types";

export interface UIState {
  disable_click_outside_modal: boolean;
  editors: User[];
}

type UIStateActions =
  | {
      type: "SET_DISABLE_CLICK_OUTSIDE_MODAL";
      payload: boolean;
    }
  | {
      type: "ADD_EDITOR";
      payload: User;
    }
  | {
      type: "REMOVE_EDITOR";
      payload: User["id"];
    };

const DEFAULT_STATE: UIState = {
  disable_click_outside_modal: false,
  editors: [],
};

const ui_state = (state: UIState = DEFAULT_STATE, action: UIStateActions) => {
  switch (action.type) {
  case "SET_DISABLE_CLICK_OUTSIDE_MODAL":
    return { ...state, disable_click_outside_modal: action.payload };

  case "ADD_EDITOR": {
    if (state.editors.find((editor) => editor.id === action.payload.id))
      return state;

    return { ...state, editors: [...state.editors, action.payload] };
  }

  case "REMOVE_EDITOR":
    return {
      ...state,
      editors: state.editors.filter((editor) => editor.id !== action.payload),
    };

  default:
    return state;
  }
};

export default ui_state;

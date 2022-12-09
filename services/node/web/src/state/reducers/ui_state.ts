export interface UIState {
  disable_click_outside_modal: boolean;
}

type UIStateActions = {
  type: "SET_DISABLE_CLICK_OUTSIDE_MODAL";
  payload: boolean;
};

const DEFAULT_STATE: UIState = {
  disable_click_outside_modal: false,
};

const ui_state = (state: UIState = DEFAULT_STATE, action: UIStateActions) => {
  switch (action.type) {
    case "SET_DISABLE_CLICK_OUTSIDE_MODAL":
      return { ...state, disable_click_outside_modal: action.payload };

    default:
      return state;
  }
};

export default ui_state;

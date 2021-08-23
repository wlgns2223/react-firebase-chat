import { SET_USER } from "../actions/types";

const initialState = {
  currentUser: null,
  isLoading: true,
};
export default function user(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        currentUser: action.payload,
        isLoading: false,
      };
    default:
      return { ...state };
  }
}

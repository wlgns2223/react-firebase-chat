import { SET_CURRENT_CHAT_ROOM } from "../actions/types";
import { SET_PRIVATE_CHAT_ROOM } from "../actions/types";

const initialState = {
  currentChatRoom: null,
  isPrivateChatRoom: false,
};
export default function chatRoom(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_CHAT_ROOM:
      return {
        ...state,
        currentChatRoom: action.payload,
      };

    case SET_PRIVATE_CHAT_ROOM:
      return {
        ...state,
        isPrivateChatRoom: action.payload,
      };
    default:
      return { ...state };
  }
}

import { SET_CURRENT_CHAT_ROOM } from "../actions/types";

export const setCurrentChatRoom = (currentChatRoom) => ({
  type: SET_CURRENT_CHAT_ROOM,
  payload: currentChatRoom,
});

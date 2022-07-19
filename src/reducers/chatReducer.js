const chatReducer = (state, action) => {
  switch (action.type) {
    case "loaded-messages": {
      return action.payload;
    }
    case "new-message": {
      let chat, index;
      for (let i = 0; i < state.length; i++) {
        if (state[i]._id === action.payload.chatId) {
          chat = state[i];
          index = i;
          break;
        }
      }
      chat.messages.push(action.payload);
      state.splice(index, 1);
      return [chat, ...state];
    }
    case "new-chat": {
      console.log(state, action.payload);
      return [action.payload, ...state];
    }
    default:
      return state;
  }
};

export default chatReducer;

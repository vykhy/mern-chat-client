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
      return [action.payload, ...state];
    }
    case "mark-as-read": {
      let chat, chatIndex, message, messageIndex;
      for (let i = 0; i < state.length; i++) {
        // find the chat to which the message belongs
        if (state[i]._id === action.payload.chatId) {
          for (let j = state[i].messages.length - 1; j >= 0; j--) {
            // find the message to mark
            if (state[i].messages[j]._id === action.payload.messageId) {
              message = state[i].messages[j];
              messageIndex = j;
              break;
            }
          }
          chat = state[i];
          chatIndex = i;
          break;
        }
      }
      // mark the message as read with timestamp
      message.read = action.payload.time;
      chat.messages[messageIndex] = message;
      state.splice(chatIndex, 1);
      // changing chat in place did not trigger re-render so I have returned it this way
      return [chat, ...state];
    }
    case "mark-as-delivered": {
      let chat, chatIndex, message, messageIndex;
      for (let i = 0; i < state.length; i++) {
        // find the chat to which the message belongs
        if (state[i]._id === action.payload.chatId) {
          for (let j = state[i].messages.length - 1; j >= 0; j--) {
            // find the message to mark
            if (state[i].messages[j]._id === action.payload.messageId) {
              message = state[i].messages[j];
              messageIndex = j;
              break;
            }
          }
          chat = state[i];
          chatIndex = i;
          break;
        }
      }
      // mark the message as read with timestamp
      message.delivered = action.payload.time;
      chat.messages[messageIndex] = message;
      state.splice(chatIndex, 1);
      // changing chat in place did not trigger re-render so I have returned it this way
      return [chat, ...state];
    }
    default:
      return state;
  }
};

export default chatReducer;

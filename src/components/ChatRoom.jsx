import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";
import { Box } from "@mui/system";
import { useSocket } from "../contexts/socketContext";
import { useAuthContext } from "../contexts/authContext";

function ChatRoom({ chatId, chats }) {
  const [message, setMessage] = useState("");
  const { user } = useAuthContext();
  const { id } = useParams();
  const [chat, setChat] = useState(
    chats?.find((chat) => chat?._id === id) || null
  );
  useEffect(() => {
    if (!chats) return;
    setChat(chats.find((chat) => chat._id === id) || null);
  }, [id, chats]);
  let newChat;
  // id of current user
  const currentUserId = user.id;
  // get the id of recipient by filtering users from chat whose id does not match
  // current user Id
  // this list has only two users => [currentUser, recipient]
  // if chat is new, chat will be null and the id prop will be a userId
  // which will be the recipient id and a new chat will be created
  let recipientId = chat && chat.users.find((user) => user !== currentUserId);
  recipientId = !recipientId ? id : recipientId;
  console.log(recipientId);
  console.log(chat);
  const { socket } = useSocket();

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message === "") return;
    newChat = chat.messages.length === 0;
    // get the chat id from chat prop
    let chatId = chat?._id || null;
    // send to chat id
    // if it is a new chat, we will send new chat property as true
    // thus the server will send the chat details along with message to the recipient

    // emit socket and send message with user's id
    socket?.emit("send-message", {
      chatId,
      recipientId,
      authorId: currentUserId,
      message,
      newChat,
    });
    setMessage("");
  };
  return (
    <div>
      <Box fullHeight sx={{ height: "100vh", position: "relative" }}>
        {message}
        <Box
          sx={{
            position: "absolute",
            top: "100%",
            width: "100%",
            transform: "translateY(-100%)",
          }}
        >
          {chat?.messages?.map((message, idx) => (
            <Box key={idx}>
              <Box>
                <b>{message.userId}</b>
                <br />
                {message.message}
              </Box>
            </Box>
          ))}
          <form
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
            }}
            onSubmit={handleSendMessage}
          >
            <TextField
              id="outlined-basic"
              label="Type your message..."
              variant="outlined"
              sx={{
                padding: "0px",
              }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              fullWidth
            />

            <button
              type="submit"
              style={{
                backgroundColor: "blue",
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                width: "55px",
                marginLeft: "3px",
              }}
              disabled={message === ""}
            >
              <SendIcon color="action" />
            </button>
          </form>
        </Box>
      </Box>
    </div>
  );
}

export default ChatRoom;

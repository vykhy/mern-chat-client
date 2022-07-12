import React from "react";
import { TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";
import { Box } from "@mui/system";
import { useSocket } from "../contexts/socketContext";

function ChatRoom({ id, chat }) {
  const [message, setMessage] = useState("");

  const { socket } = useSocket();

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message === "") return;
    // get message value
    console.log("sending...");
    // send to chat id
    // if it is a new chat, we will send the userId of the recipient
    // when the server doesnt find the chat id, it will create a new chat
    // with the current user and recipient and return the chat id

    // emit socket and send message with user's id
    socket?.emit("send-message", { id, message });
    // if responds with new chat id, add chat id to chats in memory

    // push message to local chats

    // clear message
    setMessage("");
  };
  return (
    <div>
      <Box fullHeight sx={{ height: "100vh", position: "relative" }}>
        {JSON.stringify(chat)}
        {message}
        <Box
          sx={{
            position: "absolute",
            top: "100%",
            width: "100%",
            transform: "translateY(-100%)",
          }}
        >
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

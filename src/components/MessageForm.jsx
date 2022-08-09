import React, { useState } from "react";
import { useSocket } from "../contexts/socketContext";
import { TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

function MessageForm({ chat, currentUserId }) {
  let chatId;
  const recipientId = chat && chat.users._id;

  const [message, setMessage] = useState("");
  const { socket } = useSocket();

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message === "") return;
    let newChat = chat.messages.length === 0;
    // get the chat id from chat prop
    chatId = chat?._id || null;
    // send to chat id
    // if it is a new chat, we will send new chat property as true
    // thus the server will create a new chat send the chat details along with message to the recipient

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
        style={{ background: "white", opacity: "1" }}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        fullWidth
      />

      <button
        type="submit"
        style={{
          backgroundColor: "#1674ea",
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          width: "55px",
          marginLeft: "3px",
          position: "relative",
        }}
        disabled={message === ""}
      >
        <SendIcon
          style={{
            color: "white",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translateX(-40%) translateY(-50%)",
          }}
        />
      </button>
    </form>
  );
}

export default MessageForm;

import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";
import { Box } from "@mui/system";
import { useSocket } from "../contexts/socketContext";
import { useAuthContext } from "../contexts/authContext";
import Message from "./Message";
import ChatHeader from "./ChatHeader";

function ChatRoom({ chats }) {
  const [message, setMessage] = useState("");
  const [formWidth, setFormWidth] = useState("500px");
  const { user } = useAuthContext();
  const { id } = useParams();
  const { socket } = useSocket();
  let recipientId;

  const [chat, setChat] = useState(
    chats?.find((chat) => chat?._id === id) || null
  );

  useEffect(() => {
    for (let i = chat?.messages.length - 1; i >= 0; i--) {
      if (
        chat.messages[i].read === null &&
        chat.messages[i].authorId !== user.id
      ) {
        chat.messages[i].time = new Date(Date.now());
        socket?.emit("message-read", chat.messages[i]);
        chat.messages[i].time = null;
      } else if (
        chat.messages[i].read &&
        chat.messages[i].authorId !== user.id
      ) {
        break;
      }
    }
  }, [chat, chats, socket, user]);

    recipientId = chat && chat.users._id;
  // function to scroll to the bottom of a chat
  const scrollToBottom = () => {
    const element = document.getElementById("messageContainer");
    element.scrollTop = element.scrollHeight;
  };
  // set message form width and scroll to bottom of the chatroom
  useEffect(() => {
    const setMessageFormWidth = () => {
      const width = document.getElementById("messageContainer").clientWidth;
      setFormWidth(`${width}px`);
    };
    setMessageFormWidth();
    scrollToBottom();
    window.addEventListener("resize", setMessageFormWidth);
    return () => window.removeEventListener("resize", setMessageFormWidth);
  }, []);
  useEffect(() => {
    if (!chats) return;
    setChat(chats.find((chat) => chat._id === id) || null);
  }, [id, chats]);

  let newChat;
  // id of current user
  const currentUserId = user.id;

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
    <Box
      sx={{
        minHeight: "100%",
        maxHeight: "100%",
        display: "flex",
        width: "100%",
        flexDirection: "column",
      }}
    >
      {chat && 
      <ChatHeader
        name={chat.contact || chat.users.email}
        lastSeen={chat.users.lastSeen}
        id={chat.users._id}
        img={chat.users.thumbnail}
      />}
      <Box
        style={{ overflowY: "scroll", paddingBottom: "55px" }}
        id="messageContainer"
      >
        <Box
          sx={{
            width: "100%",
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {chat?.messages?.map((message, idx) => (
            <Message key={idx} message={message} />
          ))}
        </Box>
      </Box>
      <Box
        style={{
          position: "absolute",
          top: "100%",
          width: formWidth,
          transform: "translateY(-100%)",
          backgroundColor: "white",
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
  );
}

export default ChatRoom;

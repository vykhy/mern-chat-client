import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { IconButton, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";
import { Box } from "@mui/system";
import { useSocket } from "../contexts/socketContext";
import { useAuthContext } from "../contexts/authContext";
import Message from "./Message";
import ChatHeader from "./ChatHeader";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { KeyboardDoubleArrowDown } from "@mui/icons-material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  maxWidth: "90%",
  bgcolor: "white",
  border: "none",
  borderRadius: "5px",
  boxShadow: 24,
  p: 4,
};

function ChatRoom({ chats, scrollToBottom }) {
  const [message, setMessage] = useState("");
  const [formWidth, setFormWidth] = useState("500px");
  let distanceFromBottom = 0;
  const { user } = useAuthContext();
  const { id } = useParams();
  const { socket } = useSocket();
  let recipientId;

  // MESSAGE DETALS POPUP
  const [open, setOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState(null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // FIND CURRENT CHAT FROM CHATS
  const [chat, setChat] = useState(
    chats?.find((chat) => chat?._id === id) || null
  );

  // UPON OPENING, LOOP BACKWARDS AND MARK MESSAGES AS READ
  // break when last read message found
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
  const setDistance = () => {
    const element = document.getElementById("messageContainer");
    const n1 = element.scrollHeight;
    const n2 = element.scrollTop;
    const distance = n1 - n2;
    distanceFromBottom = distance;
    console.log(distanceFromBottom);
  };
  // set message form width and scroll to bottom of the chatroom
  useEffect(() => {
    const element = document.getElementById("messageContainer");
    const setMessageFormWidth = () => {
      const width = document.getElementById("messageContainer").clientWidth;
      setFormWidth(`${width}px`);
    };
    setMessageFormWidth();
    scrollToBottom();
    window.addEventListener("resize", setMessageFormWidth);
    element.addEventListener("scroll", setDistance);
    return () => {
      window.removeEventListener("resize", setMessageFormWidth);
      element.removeEventListener("scroll", setDistance);
    };
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
  const messageDetailsPopUpHandler = (e, message) => {
    if (!message) return;
    if (message.authorId === currentUserId) {
      setPopupMessage(message);
      handleOpen();
    }
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
      className="chat-container"
    >
      {chat && (
        <ChatHeader
          name={chat.contact || chat.users.email}
          lastSeen={chat.users.lastSeen}
          id={chat.users._id}
          img={chat.users.thumbnail}
        />
      )}
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
            <Message
              key={idx}
              className="message"
              message={message}
              handlePopUp={messageDetailsPopUpHandler}
            />
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
      {/* {distanceFromBottom > 100 && ( */}
      <IconButton
        style={{
          position: "absolute",
          top: "80%",
          left: "90%",
          backgroundColor: "white",
          border: "2px solid blue",
        }}
        onClick={scrollToBottom}
      >
        <KeyboardDoubleArrowDown style={{ color: "blue" }} />
      </IconButton>
      {/* )} */}

      {open && (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography>{popupMessage.createdAt} </Typography>
            <br />
            <Typography>Message:</Typography>
            <Typography>{popupMessage.message}</Typography>
            <br />
            <Typography>Read:</Typography>
            <Typography>{popupMessage.read || "Not read"} </Typography>
            <br />
            <Typography>Delivered:</Typography>
            <Typography>
              {popupMessage.delivered || "Not delivered"}{" "}
            </Typography>
          </Box>
        </Modal>
      )}
    </Box>
  );
}

export default ChatRoom;

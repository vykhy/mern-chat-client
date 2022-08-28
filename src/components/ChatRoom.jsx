import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { format } from "fecha";
import { Box } from "@mui/system";
import { useSocket } from "../contexts/socketContext";
import { useAuthContext } from "../contexts/authContext";
import Message from "./Message";
import ChatHeader from "./ChatHeader";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useRef } from "react";
import ScrollButton from "./ScrollButton";
import MessageForm from "./MessageForm";

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
  fontWeight: "bol",
};

const ChatRoom = ({ chats, scrollToBottom, setCurrentChatId }) => {
  const [formWidth, setFormWidth] = useState("500px");
  const { user } = useAuthContext();
  const { id } = useParams();
  const { socket } = useSocket();

  // MESSAGE DETALS POPUP
  const [open, setOpen] = useState(false);
  const messageContainer = useRef();
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
    setCurrentChatId(chat?._id);
  }, [chat, chats, socket, user]);

  // set message form width and scroll to bottom of the chatroom
  useEffect(() => {
    const setMessageFormWidth = () => {
      const width = document.getElementById("messageContainer").clientWidth;
      setFormWidth(`${width}px`);
    };
    setMessageFormWidth();
    scrollToBottom();
    //setDistance();
    window.addEventListener("resize", setMessageFormWidth);
    return () => {
      window.removeEventListener("resize", setMessageFormWidth);
    };
  }, [messageContainer, chat]);
  useEffect(() => {
    if (!chats) return;
    setChat(chats.find((chat) => chat._id === id) || null);
  }, [id, chats]);

  // id of current user
  const currentUserId = user.id;

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
        style={{
          overflowY: "scroll",
          scrollBehaviour: "smooth",
          paddingLeft: "5px",
          flexGrow: 1,
          backgroundColor: "#f0f0f0",
        }}
        id="messageContainer"
        ref={messageContainer}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
          style={{ scrollBehaviour: "smooth" }}
        >
          {chat?.messages.slice(-30).map((message, index) => (
            <Message
              key={index}
              className="message"
              message={message}
              handlePopUp={messageDetailsPopUpHandler}
            />
          ))}
        </Box>
      </Box>
      <Box
        style={{
          width: formWidth,
          backgroundColor: "#1674ea",
        }}
      >
        <MessageForm chat={chat} currentUserId={currentUserId} />
      </Box>
      <ScrollButton
        messageContainer={messageContainer}
        scrollToBottom={scrollToBottom}
      />

      {open && (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography variant="body2">
              {format(
                new Date(popupMessage.createdAt),
                "HH:mm, dddd, MMM Do, YYYY "
              )}{" "}
            </Typography>
            <br />
            <Typography style={{ color: "#a0a0a0" }} variant="body2">
              Message:
            </Typography>
            <Typography style={{ fontWeight: "bold" }} variant="subtitle1">
              {popupMessage.message}
            </Typography>
            <br />
            <Typography style={{ color: "#a0a0a0" }} variant="body2">
              Read:
            </Typography>
            <Typography variant="body2">
              {popupMessage.read
                ? format(
                    new Date(popupMessage.read),
                    "HH:mm, dddd, MMMM Do, YYYY "
                  )
                : "Not read"}
            </Typography>
            <br />
            <Typography style={{ color: "#a0a0a0" }} variant="body2">
              Delivered:
            </Typography>
            <Typography variant="body2">
              {popupMessage.delivered
                ? format(
                    new Date(popupMessage.delivered),
                    "HH:mm, dddd, MMMM Do, YYYY "
                  )
                : "Not delivered"}
            </Typography>
          </Box>
        </Modal>
      )}
    </Box>
  );
};

export default ChatRoom;

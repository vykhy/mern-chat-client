import React, { useEffect } from "react";
import Chats from "../components/Chats";
import ChatRoom from "../components/ChatRoom";
import { useSocket } from "../contexts/socketContext";
import { useParams } from "react-router-dom";
import { Grid } from "@mui/material";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

function ChatsContainer({ chats, addMessage, addNewChat, dispatch }) {
  const { socket } = useSocket();
  const axiosPrivate = useAxiosPrivate();
  let { id } = useParams();

  useEffect(() => {
    socket?.on("new-message", (data) => handleNewMessage(data));
    socket?.on("message-sent", (data) => handleMessageSent(data));
    socket?.on("new-chat-message", (data) => handleNewChat(data));
    socket?.on("marked-as-read", (data) => handleMarkedAsRead(data));
    socket?.on("marked-as-delivered", (data) => handleMarkedAsDelivered(data));

    return () => {
      socket?.off("new-message");
      socket?.off("message-sent");
      socket?.off("new-chat-message");
      socket?.off("marked-as-read");
      socket?.off("marked-as-delivered");
    };
  });

  const handleNewChat = async (data) => {
    const chat = data.chat;
    const message = data.message;
    if (chats.find((chat) => chat._id === data.chat._id)) {
      addMessage(message);
      return;
    } else {
      const contact = await axiosPrivate.get(`/contacts/${message.authorId}`);
      chat.contact = contact.data.name;
      message.delivered = new Date(Date.now());
      chat.messages = [message];

      chat.users = chat.users.find(
        (user) => user._id.valueOf() == message.authorId
      );
      message.time = message.delivered;
      socket?.emit("message-delivered", message);
      addNewChat(chat);
    }
  };
  const handleNewMessage = (data) => {
    data.delivered = new Date(Date.now());
    addMessage(data);
    // emit to mark message as delivered
    data.time = data.delivered;
    socket?.emit("message-delivered", data);
  };
  const handleMessageSent = (data) => {
    addMessage(data);
  };
  const handleMarkedAsRead = (data) => {
    dispatch({ type: "mark-as-read", payload: data });
  };
  const handleMarkedAsDelivered = (data) => {
    dispatch({ type: "mark-as-delivered", payload: data });
  };
  const addNewChat = (data) => {
    dispatch({ type: "new-chat", payload: data });
  };

  const addMessage = (data) => {
    dispatch({ type: "new-message", payload: data });
  };
  return (
    <>
      <Grid container style={{ height: "95%" }}>
        <Grid
          item
          sx={{ display: { xs: "none", sm: "block" } }}
          sm={3}
          style={{ height: "95%", overflowY: "scroll" }}
        >
          <Chats chats={chats}></Chats>
        </Grid>
        <Grid
          item
          xs={12}
          sm={9}
          style={{
            height: "95%",
            // overflowY: "scroll",
          }}
        >
          {id ? (
            <ChatRoom chats={chats} dispatch={dispatch} />
          ) : (
            <h3>Click on a chat to open.</h3>
          )}
        </Grid>
        {chats.length <= 0 ? <Grid>You have no chats yet!</Grid> : null}
      </Grid>
    </>
  );
}

export default ChatsContainer;

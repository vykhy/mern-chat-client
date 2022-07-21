import React, { useState, useEffect } from "react";
import Chats from "../components/Chats";
import ChatRoom from "../components/ChatRoom";
import { useSocket } from "../contexts/socketContext";
import { useParams } from "react-router-dom";
import { Grid, textFieldClasses } from "@mui/material";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

function ChatsContainer({ chats, addMessage, addNewChat }) {
  const { socket } = useSocket();
  const axiosPrivate = useAxiosPrivate();
  let { id } = useParams();

  useEffect(() => {
    socket?.on("new-message", (data) => handleNewMessage(data));
    socket?.on("message-sent", (data) => handleMessageSent(data));
    socket?.on("new-chat-message", (data) => handleNewChat(data));

    return () => {
      socket?.off("new-message");
      socket?.off("message-sent");
      socket?.off("new-chat-message");
    };
  }, [socket]);

  const handleNewChat = async (data) => {
    const chat = data.chat;
    const message = data.message;
    if (chats.find((chat) => chat._id === data.chat._id)) {
      addMessage(message);
      return;
    } else {
      const contact = await axiosPrivate.get(`/contacts/${message.authorId}`);
      chat.contact = contact.data;
      chat.messages = [message];
      addNewChat(chat);
    }

    // addNewMessage(message)
  };
  const handleNewMessage = (data) => {
    addMessage(data);
  };
  const handleMessageSent = (data) => {
    addMessage(data);
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
            <ChatRoom chatId={id} chats={chats} />
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

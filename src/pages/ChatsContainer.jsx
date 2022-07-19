import React, { useState, useEffect } from "react";
import Chats from "../components/Chats";
import ChatRoom from "../components/ChatRoom";
import { useSocket } from "../contexts/socketContext";
import { useParams } from "react-router-dom";
import { Grid, textFieldClasses } from "@mui/material";

function ChatsContainer({ chats, addMessage, addNewChat }) {
  const { socket } = useSocket();
  const { id } = useParams();

  useEffect(() => {
    socket?.on("new-message", (data) => handleNewMessage(data));
    socket?.on("message-sent", (data) => handleMessageSent(data));

    return () => {
      socket?.off("new-message");
      socket?.off("message-sent");
    };
  }, [socket]);

  const handleNewMessage = (data) => {
    console.log(data);
    if (data.chat) {
      addNewChat(data);
    } else {
      addMessage(data);
    }
  };
  const handleMessageSent = (data) => {
    if (data.chat) addNewChat(data);
    else addMessage(data);
  };
  return (
    <>
      <Grid container>
        <Grid item sx={{ display: { xs: "none", sm: "block" } }} sm={3}>
          <Chats chats={chats}></Chats>
        </Grid>
        <Grid item xs={12} sm={9}>
          <ChatRoom chatId={id} chats={chats} />
        </Grid>
        {chats.length <= 0 ? <Grid>You have no chats yet!</Grid> : null}
      </Grid>
    </>
  );
}

export default ChatsContainer;

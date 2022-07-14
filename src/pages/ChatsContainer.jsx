import React, { useState, useEffect } from "react";
import Chats from "../components/Chats";
import ChatRoom from "../components/ChatRoom";
import { useSocket } from "../contexts/socketContext";
import { useParams } from "react-router-dom";
import { Grid } from "@mui/material";

function ChatsContainer({ chats, addMessage, addNewChat, triggerRerender }) {
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
    triggerRerender();
  };
  const handleMessageSent = (data) => {
    console.log(data);
    if (data.chat) addNewChat(data);
    else addMessage(data);
    triggerRerender();
  };
  return (
    <>
      <Grid container>
        <Grid item sx={{ display: { xs: "none", sm: "block" } }} sm={3}>
          <Chats chats={chats}></Chats>
        </Grid>
        <Grid item xs={12} sm={9}>
          <ChatRoom id={id} chats={chats} triggerRerender={triggerRerender} />
        </Grid>
      </Grid>
    </>
  );
}

export default ChatsContainer;

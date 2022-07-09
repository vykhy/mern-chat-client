import React, { useState, useEffect } from "react";
import Chats from "../components/Chats";
import ChatRoom from "../components/ChatRoom";
import { useSocket } from "../contexts/socketContext";
import { useParams } from "react-router-dom";
import { Grid } from "@mui/material";

function ChatsContainer({ chats }) {
  const socket = useSocket();
  const { id } = useParams();
  const chat = chats.filter((chat) => chat.id === id)[0];
  return (
    <>
      <Grid container>
        <Grid item sx={{ display: { xs: "none", sm: "block" } }} sm={3}>
          <Chats chats={chats}></Chats>
        </Grid>
        <Grid item xs={12} sm={9}>
          <ChatRoom id={id} chat={chat} />
        </Grid>
      </Grid>
    </>
  );
}

export default ChatsContainer;

import React from "react";
import Chats from "../components/Chats";
import ChatRoom from "../components/ChatRoom";
import { useParams } from "react-router-dom";
import { Grid } from "@mui/material";

function ChatsContainer({ chats, scrollToBottom, setCurrentChatId }) {
  let { id } = useParams();

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
            <ChatRoom
              chats={chats}
              scrollToBottom={scrollToBottom}
              setCurrentChatId={setCurrentChatId}
            />
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

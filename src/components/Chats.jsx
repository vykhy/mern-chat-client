import React from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import MenuList from "@mui/material/MenuList";
import Chat from "./Chat";
import { Typography } from "@mui/material";

function Chats({ chats }) {
  return (
    <Box
      sx={{
        flexGrow: 1,
        maxWidth: 400,
        // borderRight: "3px solid gray",
        height: "100%",
      }}
    >
      <Grid container spacing={2}>
        <MenuList style={{ width: "100%", paddingTop: "25px" }}>
          {chats.length > 0 ?
            // sort chats by last message
            chats.sort((a, b) =>
              a.messages[a.messages.length - 1]?.createdAt <
              b.messages[b.messages.length - 1]?.createdAt
                ? 1
                : b.messages[b.messages.length - 1]?.createdAt <
                  a.messages[a.messages.length - 1]?.createdAt
                ? -1
                : 0
            )
            .map((chat, idx) => (
              <Link
                to={`/chats/${chat._id}`}
                style={{ textDecoration: "none" }}
                key={idx}
              >
                <Chat chat={chat} chats={chats} />
              </Link>
            )):
            <Typography variant={'h5'} style={{ marginLeft: '10px'}}>You have no chats yet</Typography>
            }
        </MenuList>
      </Grid>
    </Box>
  );
}

export default Chats;

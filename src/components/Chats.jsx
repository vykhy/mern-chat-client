import React from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import MenuList from "@mui/material/MenuList";
import Chat from "./Chat";

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
          {chats?.map((chat, idx) => (
            <Link
              to={`/chats/${chat._id}`}
              style={{ textDecoration: "none" }}
              key={idx}
            >
              <Chat chat={chat} chats={chats} />
            </Link>
          ))}
          {chats?.map((chat, idx) => (
            <Link
              to={`/chats/${chat._id}`}
              style={{ textDecoration: "none" }}
              key={idx}
            >
              <Chat chat={chat} chats={chats} />
            </Link>
          ))}
          {chats?.map((chat, idx) => (
            <Link
              to={`/chats/${chat._id}`}
              style={{ textDecoration: "none" }}
              key={idx}
            >
              <Chat chat={chat} chats={chats} />
            </Link>
          ))}
          {chats?.map((chat, idx) => (
            <Link
              to={`/chats/${chat._id}`}
              style={{ textDecoration: "none" }}
              key={idx}
            >
              <Chat chat={chat} chats={chats} />
            </Link>
          ))}
          {chats?.map((chat, idx) => (
            <Link
              to={`/chats/${chat._id}`}
              style={{ textDecoration: "none" }}
              key={idx}
            >
              <Chat chat={chat} chats={chats} />
            </Link>
          ))}
          {chats?.map((chat, idx) => (
            <Link
              to={`/chats/${chat._id}`}
              style={{ textDecoration: "none" }}
              key={idx}
            >
              <Chat chat={chat} chats={chats} />
            </Link>
          ))}
        </MenuList>
      </Grid>
    </Box>
  );
}

export default Chats;

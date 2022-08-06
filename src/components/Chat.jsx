import React, { useState, useEffect } from "react";
import {
  Grid,
  ListItemText,
  MenuItem,
  ListItemAvatar,
  Avatar,
  Typography,
} from "@mui/material";
import { useAuthContext } from "../contexts/authContext";

function Chat({ chats, chat }) {
  const [unreadCount, setUnreadCount] = useState(0); // count of unread messages
  const { user } = useAuthContext();
  useEffect(() => {
    let unread = 0;
    for (let i = chat.messages.length - 1; i >= 0; i--) {
      // increase unread message count for every unread message not created by this user
      if (
        chat.messages[i].read === null &&
        chat.messages[i].authorId !== user.id
      ) {
        unread += 1;
      } else if (
        chat.messages[i].read &&
        chat.messages[i].authorId === user.id
      ) {
        break;
      }
    }
    setUnreadCount(unread);
  }, [chats]);

  return (
    <MenuItem style={{ borderBottom: "1px solid gray" }}>
      <Grid container>
        <Grid item xs={3}>
          <ListItemAvatar>
            <Avatar src={chat.users.thumbnail || "/images/default-user.png"} />
          </ListItemAvatar>
        </Grid>
        <Grid item xs={7} sx={{ overflow: "hidden" }}>
          <ListItemText
            cursor={"pointer"}
            primary={chat.contact ? chat.contact : chat.users.email}
            secondary={
              chat.messages.length > 0
                ? chat.messages[chat.messages.length - 1].message
                : "No message"
            }
          />
        </Grid>
        <Grid
          item
          xs={2}
          style={{
            display: "flex",
            alignItems: "center",
            justifyItems: "center",
            padding: "5px",
          }}
        >
          {unreadCount > 0 && (
            <Typography
              cursor={"pointer"}
              style={{
                borderRadius: "50%",
                backgroundColor: "blue",
                color: "white",
                padding: "5px",
                minWidth: "25px",
              }}
              sx={{ textAlign: "center", fontSize: 10 }}
            >
              {unreadCount}
            </Typography>
          )}
        </Grid>
      </Grid>
    </MenuItem>
  );
}

export default Chat;

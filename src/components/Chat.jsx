import React from "react";
import {
  Grid,
  ListItemText,
  MenuItem,
  ListItemAvatar,
  Avatar,
  Typography,
} from "@mui/material";

function Chat({ chat }) {
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
          <Typography
            cursor={"pointer"}
            style={{
              borderRadius: "50%",
              backgroundColor: "blue",
              color: "white",
              padding: "5px",
              minWidth: "15px",
            }}
            sx={{ textAlign: "center", fontSize: 10 }}
          >
            1
          </Typography>
        </Grid>
      </Grid>
    </MenuItem>
  );
}

export default Chat;

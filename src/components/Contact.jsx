import React, { useEffect } from "react";
import MenuItem from "@mui/material/MenuItem";
import { Button, Divider } from "@mui/material";
import { Grid } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useAuthContext } from "../contexts/authContext";

function Contact({ contact, chats, dispatch, goTo }) {
  const secondary = true;
  const axiosPrivate = useAxiosPrivate();
  let chatExists;
  const {
    user: { id },
  } = useAuthContext();

  chatExists =
    chats.length > 0 &&
    chats.find((chat) => chat.users._id === contact.contactId._id);

  const createChat = async () => {
    const response = await axiosPrivate.post(`${process.env.REACT_APP_DEV_SERVER_URL}/chats/create`, {
      userId1: contact.contactId._id,
      userId2: id,
    });
    const contactResponse = await axiosPrivate.get(
      `${process.env.REACT_APP_DEV_SERVER_URL}/contacts/${contact.contactId._id}`
    );
    const chatContact = contactResponse.data;
    let newChat = response.data;
    newChat.users = newChat.users.find((user) => user._id !== id);
    newChat.contact = chatContact.name;
    newChat.messages = [];
    dispatch({ type: "new-chat", payload: newChat });
  };
  return (
    <MenuItem sx={{ width: "100%", borderBottom: "1px solid #c0c0c0" }}>
      <Grid container>
        <Grid item xs={2}>
          <ListItemAvatar>
            <Avatar
              src={contact.contactId.thumbnail || "/images/default-user.png"}
            />
          </ListItemAvatar>
        </Grid>
        <Grid item xs={6}>
          <ListItemText
            cursor={"pointer"}
            primary={contact.name}
            secondary={secondary ? contact.contactId.email : null}
          />
        </Grid>
        <Grid item xs={4}>
          {chatExists ? (
            <Button
              onClick={() => goTo(`/chats/${chatExists._id}`)}
              variant="outlined"
              style={{ width: "100%" }}
            >
              Go to chat
            </Button>
          ) : (
            <Button
              variant="contained"
              style={{ width: "100%" }}
              onClick={createChat}
            >
              Create chat
            </Button>
          )}
        </Grid>
      </Grid>
      {/* </Link> */}

      <Divider />
    </MenuItem>
  );
}

export default Contact;

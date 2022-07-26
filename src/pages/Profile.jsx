import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowForwardIos } from "@mui/icons-material";
import {
  Grid,
  Box,
  Typography,
  Avatar,
  MenuList,
  MenuItem,
} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { useState } from "react";
import { useAuthContext } from "../contexts/authContext";

function Profile({ chats }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuthContext();
  const [profileUser, setProfileUser] = useState();
  const [contactName, setContactName] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  useEffect(() => {
    if (!id || id === user.id) {
      const fetchUser = async () => {
        console.log(user);
        return "money";
      };
      setProfileUser(fetchUser());
      setIsOwnProfile(true);
    } else {
      const chatOfUser = chats?.find((chat) => chat.users._id === id);
      setChatId(chatOfUser._id);
      setContactName(chatOfUser.contact);
      setProfileUser(chatOfUser.users);
    }
  }, [id, profileUser, user.id]);
  const goToChat = () => {
    navigate(`/chats/${chatId}`);
  };
  return (
    <Grid
      container
      display={"flex"}
      justifyContent={"center"}
      style={{ backgroundColor: "rgb(230,230,230)" }}
    >
      <Grid item xs={12} md={8} lg={6} style={{ backgroundColor: "white" }}>
        {/* boxShadow: "0px 0px 103px -29px rgba(0,0,0,0.72)", */}
        <Typography style={{ margin: "5px" }} variant={"h4"}>
          {contactName || profileUser?.email}
        </Typography>
        <Box
          fullWidth
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "gray",
            borderRadius: "10px",
          }}
        >
          <Avatar
            src={
              profileUser?.profilePicture || "/public/images/default-user.png"
            }
            sx={{
              height: 350,
              width: 350,
              border: "5px solid white",
              maxWidth: "100%",
            }}
          ></Avatar>
        </Box>
        <List
          sx={{
            width: "100%",
            bgcolor: "background.paper",
          }}
        >
          <ListItem>
            <ListItemText
              primary={`${profileUser?.firstName} ${profileUser?.lastName}`}
              secondary={profileUser?.email}
            />
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemText primary="About" secondary={profileUser?.about} />
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemText
              primary="Last seen"
              secondary={profileUser?.lastSeen}
            />
          </ListItem>
          <Divider component="li" />
        </List>
        {isOwnProfile ? (
          "Edit Profile"
        ) : (
          <MenuList style={{ padding: "0px" }} fullWidth onClick={goToChat}>
            <MenuItem fullWidth style={{ height: "40px" }}>
              <ListItemText primary="Go to Chat" />
              <ArrowForwardIos />
            </MenuItem>
          </MenuList>
        )}
      </Grid>
    </Grid>
  );
}

export default Profile;

import React, { useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
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
import useAxiosPrivate from "../hooks/useAxiosPrivate";

function Profile({ chats }) {
  const navigate = useNavigate();
  const { id } = useParams(); // id of user. empty for current user profile
  const axiosPrivate = useAxiosPrivate();
  const { user } = useAuthContext(); // current user
  const [profileUser, setProfileUser] = useState(); // profile details of the profile being viewed
  const [contactName, setContactName] = useState(null); // contact name if this user has been saved
  const [chatId, setChatId] = useState(null); // the chat id of the chat with this user
  const [isOwnProfile, setIsOwnProfile] = useState(false); // whether we are viewing our own profile
  useEffect(() => {
    // fetches details of a user by taking the user's id
    const fetchUser = async (id) => {
      const response = await axiosPrivate.get(`/users/${id}`);
      const userDetails = response.data;
      setProfileUser(userDetails);
    };
    // if there is no id or id is same as current user, get details of current user
    if (!id || id === user.id) {
      fetchUser(user.id);
      setIsOwnProfile(true);
    } else {
      // get details of whoever that user is
      const chatOfUser = chats?.find((chat) => chat.users._id === id);
      setChatId(chatOfUser._id); // set the chat id
      setContactName(chatOfUser.contact); //set contact name
      fetchUser(id);
    }
  }, [id, user.id]);
  const goToChat = () => {
    navigate(`/chats/${chatId}`);
  };
  const goToEditProfile = () => {
    navigate("/profile/edit");
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
          {isOwnProfile ? "Your Profile" : contactName || profileUser?.email}
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
            src={profileUser?.profilePicture || "/images/default-user.png"}
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
          {isOwnProfile && (
            <Link to="/profile/image">
              <MenuList style={{ padding: "0px" }} fullWidth>
                <MenuItem fullWidth style={{ height: "40px" }}>
                  <ListItemText primary="Edit Profile Picture" />
                  <ArrowForwardIos />
                </MenuItem>
                <Divider component="li" />
              </MenuList>
            </Link>
          )}
          <ListItem>
            <ListItemText
              primary={
                profileUser &&
                `${profileUser?.firstName} ${profileUser?.lastName}`
              }
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
          <MenuList
            style={{ padding: "0px" }}
            fullWidth
            onClick={goToEditProfile}
          >
            <MenuItem fullWidth style={{ height: "40px" }}>
              <ListItemText primary="Edit Profile" />
              <ArrowForwardIos />
            </MenuItem>
          </MenuList>
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

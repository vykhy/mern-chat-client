import React from "react";
import { useNavigate } from "react-router-dom";
import {
  MenuList,
  MenuItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@mui/material";

function ChatHeader({ img, name, lastSeen, id }) {
  const navigate = useNavigate();
  const goToUserProfile = () => {
    navigate(`/profile/${id}`);
  };
  return (
    <>
      <MenuList onClick={goToUserProfile} style={{ cursor: "pointer" }}>
        <MenuItem>
          <ListItemAvatar>
            <Avatar src={img ? img : "/images/default-user.png"}></Avatar>
          </ListItemAvatar>
          <ListItemText primary={name} secondary={lastSeen}></ListItemText>
        </MenuItem>
      </MenuList>
    </>
  );
}

export default ChatHeader;

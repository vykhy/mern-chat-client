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
      <MenuList
        onClick={goToUserProfile}
        style={{
          cursor: "pointer",
          paddingBottom: "0",
          marginTop: "0px",
          boxShadow: "0px 11px 12px -12px rgba(102,102,102,0.8)",
        }}
      >
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

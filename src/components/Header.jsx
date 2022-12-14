import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/authContext";

import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Logout from "@mui/icons-material/Logout";

export default function Header({ unopenedChats }) {
  const { user, removeToken, removeUser } = useAuthContext();
  const navigate = useNavigate();
  const handleLogout = () => {
    removeUser();
    removeToken();
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const goTo = (url) => {
    handleClose();
    navigate(url);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <Box
        fullWidth
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          textAlign: "center",
        }}
        style={{
          padding: "8px",
          zIndex: 5,
          backgroundColor: "#1674ea",
          boxShadow: "0px 11px 12px -12px rgba(102,102,102,1)",
        }}
      >
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "#fff",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography variant={"h6"} sx={{ minWidth: 100 }}>
            Chats{" "}
          </Typography>
          {unopenedChats > 0 && (
            <Typography
              cursor={"pointer"}
              style={{
                borderRadius: "50%",
                backgroundColor: "#fff",
                color: "blue",
                fontWeight: "bolder",
                padding: "5px",
                minWidth: "35px",
              }}
              sx={{ textAlign: "center", fontSize: 16 }}
            >
              {unopenedChats}
            </Typography>
          )}
        </Link>
        <Link
          to="/contacts"
          style={{
            textDecoration: "none",
            color: "#fff",
          }}
        >
          <Typography variant={"h6"} sx={{ minWidth: 100 }}>
            Contacts
          </Typography>
        </Link>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar
              src={user?.thumbnail || "/images/default-user.png"}
              sx={{ width: 32, height: 32 }}
            ></Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      {open && (
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={() => goTo("/profile")}>
            <Avatar src={user?.thumbnail || "/images/default-user.png"} /> My
            Profile
          </MenuItem>
          {/* <MenuItem>
          <Avatar /> My account
        </MenuItem> */}
          <Divider />
          <MenuItem onClick={() => goTo("/contacts/add")}>
            <ListItemIcon>
              <PersonAdd fontSize="small" />
            </ListItemIcon>
            Add new Contact
          </MenuItem>
          {/* <MenuItem>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem> */}
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      )}
    </React.Fragment>
  );
}

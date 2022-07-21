import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/authContext";
import { useSocket } from "../contexts/socketContext";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Chats from "../components/Chats";

const Home = ({ chats }) => {
  const { socket } = useSocket();
  const { user, setNewUser, removeUser, removeToken } = useAuthContext();
  const [text, setText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (window.innerWidth > 768) {
      navigate(`/chats`);
    }
  }, []);

  const testSocket = () => {
    socket.emit("yes");
  };

  /** SOCKET EVENT LISTENERS */
  socket &&
    socket.on("working", (data) => {
      console.log(data);
    });
  const handleLogout = () => {
    removeUser();
    removeToken();
  };

  return (
    <div>
      {text && <p>{text}</p>}
      <button onClick={() => setNewUser("Marco o7")}>Log in</button>
      <button onClick={() => handleLogout()}>Log out</button>
      <br />
      <button onClick={() => testSocket()}>test socket</button>
      <Grid container>
        <Grid item padding={"10px"}>
          <Link href="/contacts/add" variant="body2">
            {"Add New Contact"}
          </Link>
        </Grid>
        <Grid item padding={"10px"}>
          <Chats chats={chats}></Chats>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;

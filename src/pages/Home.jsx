import React, { useState } from "react";
import { useAuthContext } from "../contexts/authContext";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useSocket } from "../contexts/socketContext";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";

const Home = () => {
  const axiosPrivate = useAxiosPrivate();
  const { socket } = useSocket();
  const { user, setNewUser, removeUser, removeToken } = useAuthContext();
  const [text, setText] = useState("");

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

  const test = async () => {
    setText("Testing...");
    const response = await axiosPrivate.get("/test");
    setText(response.data.text);
  };
  return (
    <div>
      <h1>Home</h1>
      <p>
        {user !== null
          ? `You are logged in as ${user.name}`
          : "There is no user"}
      </p>
      {text && <p>{text}</p>}
      <button onClick={() => setNewUser("Marco o7")}>Log in</button>
      <button onClick={() => handleLogout()}>Log out</button>
      <button onClick={() => test()}>Test</button>
      <br />
      <button
        onClick={() => {
          axiosPrivate
            .get("/users/all")
            .then((data) => null)
            .catch((e) => null);
        }}
      >
        See users
      </button>
      <br />
      <button
        onClick={() => {
          axiosPrivate
            .get("/deletecontacts")
            .then((data) => null)
            .catch((e) => null);
        }}
      >
        Delete contacts
      </button>
      <br />
      <button onClick={() => testSocket()}>test socket</button>
      <Grid container>
        <Grid item padding={"10px"}>
          <Link href="/contacts/add" variant="body2">
            {"Add New Contact"}
          </Link>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;

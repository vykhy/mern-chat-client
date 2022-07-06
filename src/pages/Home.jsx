import React, { useState } from "react";
import { useAuthContext } from "../contexts/authContext";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

function Home() {
  const axiosPrivate = useAxiosPrivate();
  const { user, setNewUser, removeUser, removeToken } = useAuthContext();
  const [text, setText] = useState("");

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
    </div>
  );
}

export default Home;

import React from "react";
import { useAuthContext } from "../contexts/authContext";

function Home() {
  const { user, setNewUser, removeUser } = useAuthContext();
  return (
    <div>
      <h1>Home</h1>
      <p>
        {user !== null
          ? `You are logged in as ${user.name}`
          : "There is no user"}
      </p>
      <button onClick={() => setNewUser("Marco o7")}>Log in</button>
      <button onClick={() => removeUser()}>Log out</button>
    </div>
  );
}

export default Home;

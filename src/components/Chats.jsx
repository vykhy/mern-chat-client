import React from "react";
import { Link } from "react-router-dom";
import Chat from "./Chat";

function Chats({ chats }) {
  return (
    <>
      {chats?.map((chat, idx) => (
        <Link to={`/chats/${chat._id}`} key={idx}>
          <Chat chat={chat} />
        </Link>
      ))}
    </>
  );
}

export default Chats;

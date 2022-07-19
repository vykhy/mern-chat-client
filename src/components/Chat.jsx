import React from "react";

function Chat({ chat }) {
  return <div>{chat.contact ? chat.contact.name : "unknown"}</div>;
}

export default Chat;

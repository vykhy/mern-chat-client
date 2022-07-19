import React from "react";

function Chat({ chat }) {
  console.log(chat.contact);
  return <div>{chat.contact ? chat.contact.name : "unknown"}</div>;
}

export default Chat;

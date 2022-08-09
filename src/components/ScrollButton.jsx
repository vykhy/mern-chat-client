import React, { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import { KeyboardDoubleArrowDown } from "@mui/icons-material";

function ScrollButton({ messageContainer, scrollToBottom }) {
  const [distanceFromBottom, setDistanceFromBottom] = useState(0);

  useEffect(() => {
    messageContainer.current?.addEventListener("scroll", setDistance);
  });

  const setDistance = () => {
    const element = messageContainer.current;
    if (!element) return;
    setDistanceFromBottom(element.scrollHeight - element.scrollTop);
  };
  return (
    distanceFromBottom > 1000 && (
      // We will not show scrollToBottom button if user is already at the bottom of the chat
      <IconButton
        style={{
          position: "absolute",
          top: "80%",
          left: "80%",
          backgroundColor: "white",
          border: "2px solid #1674ea",
        }}
        onClick={scrollToBottom}
      >
        <KeyboardDoubleArrowDown style={{ color: "#1674ea" }} />
      </IconButton>
    )
  );
}

export default ScrollButton;

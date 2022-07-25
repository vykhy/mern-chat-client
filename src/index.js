import React from "react";
import { createRoot } from "react-dom/client";
import AuthContextProvider from "./contexts/authContext";
import SocketContextProvider from "./contexts/socketContext";
import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(
  <AuthContextProvider>
    <SocketContextProvider>
      <App />
    </SocketContextProvider>
  </AuthContextProvider>
);

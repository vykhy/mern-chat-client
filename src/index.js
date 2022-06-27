import React from "react";
import { createRoot } from "react-dom/client";
import AuthContextProvider from "./contexts/authContext";
import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(
  <AuthContextProvider>
    <App />
  </AuthContextProvider>
);

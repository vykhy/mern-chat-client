import React, { Suspense, lazy, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SocketContextProvider from "./contexts/socketContext";
import "./App.css";
import { useAuthContext } from "./contexts/authContext";

const Home = lazy(() => import("./pages/Home"));
const Contacts = lazy(() => import("./pages/Contacts"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const AddContact = lazy(() => import("./pages/AddContact"));
const ChatsContainer = lazy(() => import("./pages/ChatsContainer"));

const App = () => {
  const { user } = useAuthContext();
  const loggedIn = user !== null;

  const fakeChats = [{ id: "lmao" }, { id: "cow" }];
  const [chats, setChats] = useState(fakeChats);

  useEffect(() => {
    const fetchAndSetChats = async () => {
      console.log("chats fetched...");
      // fetch chats
      // fetch contacts
      // map chat to contacts
    };
    fetchAndSetChats();
  }, []);

  return (
    <div>
      {user && <p>You are now logged in {user.name}</p>}
      <BrowserRouter>
        <Suspense fallback={"Loading"}>
          {loggedIn ? (
            <SocketContextProvider id={user.id}>
              <Routes>
                <Route path="/" element={<Home chats={chats} />} />
                <Route
                  path="/chats/:id"
                  element={<ChatsContainer chats={chats} />}
                />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/contacts/add" element={<AddContact />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </SocketContextProvider>
          ) : (
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<Login />} />
            </Routes>
          )}
        </Suspense>
      </BrowserRouter>
    </div>
  );
};

export default App;

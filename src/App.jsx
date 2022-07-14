import React, { Suspense, lazy, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SocketContextProvider from "./contexts/socketContext";
import "./App.css";
import { useAuthContext } from "./contexts/authContext";
import useAxiosPrivate from "./hooks/useAxiosPrivate";

const Home = lazy(() => import("./pages/Home"));
const Contacts = lazy(() => import("./pages/Contacts"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const AddContact = lazy(() => import("./pages/AddContact"));
const ChatsContainer = lazy(() => import("./pages/ChatsContainer"));

const App = () => {
  const { user, accessToken, removeUser, removeToken } = useAuthContext();
  const axiosPrivate = useAxiosPrivate();
  const loggedIn = user !== null;

  const fakeChats = [
    { id: "lmao", messages: [] },
    { id: "cow", messages: [] },
  ];
  const [chats, setChats] = useState(fakeChats);
  const [random, setRandom] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    // Since we store our access token in local storage, we will verify this token
    // whenever our app loads so that users do not access the app with inauthentic
    // tokens.
    // Our axios interceptor will also refresh any expired tokens so that we can
    // access user data inside our socket without requiring to refresh through the socket.
    // If our verification endpoint throws an error, the user is automatically
    // logged out.
    const verifyTokenFoundInStorage = async () => {
      try {
        const result = await axiosPrivate.get("/auth/verify");
      } catch (err) {
        removeToken();
        removeUser();
      }
    };
    verifyTokenFoundInStorage();
  }, [user, accessToken]);

  useEffect(() => {
    const fetchAndSetChats = async () => {
      console.log("chats fetched...");
      // fetch chats
      const response = await axiosPrivate.get("/chats");
      const data = response.data;
      setChats(data.chats);
      console.log(chats);
      // fetch contacts
      // map chat to contacts
    };
    fetchAndSetChats();
  }, []);

  const triggerRerender = () => {
    setRandom((prevState) => !prevState);
  };
  const addNewChat = (data) => {
    let chat = {
      _id: data.chat._id,
      messages: [data.message],
    };
    chats.push(chat);
  };

  const addMessage = (data) => {
    setChats((chats) =>
      chats
        .find((chat) => chat._id === data.message.chatId)
        .messages.push(data.message)
    );
    console.log(chats);
  };
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
                  element={
                    <ChatsContainer
                      chats={chats}
                      addNewChat={addNewChat}
                      addMessage={addMessage}
                      triggerRerender={triggerRerender}
                    />
                  }
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

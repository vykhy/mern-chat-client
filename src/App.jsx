import React, { Suspense, lazy, useEffect, useState, useReducer } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SocketContextProvider from "./contexts/socketContext";
import "./App.css";
import { useAuthContext } from "./contexts/authContext";
import useAxiosPrivate from "./hooks/useAxiosPrivate";
import chatReducer from "./reducers/chatReducer";
import Header from "./components/Header";

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

  const [chats, dispatch] = useReducer(chatReducer, []);

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
    if (!loggedIn) return;
    const fetchAndSetChats = async () => {
      // fetch chats
      const response = await axiosPrivate.get("/chats");
      const chats = response.data.chats;
      // fetch contacts
      const contactResponse = await axiosPrivate.get("/contacts");
      const contacts = contactResponse.data.contacts;
      // map chat to contacts
      chats.forEach((chat) => {
        chat.contact =
          contacts.find((contact) =>
            // find chat where user id of contact and chat match
            // filter chat users array because the current user is in all the chats
            // and it caused the name of current user to be rendered on every chat
            chat.users
              .filter((id) => user.id != id)
              .includes(contact.contactId._id)
          ) || null;
      });
      // console.log(contacts);
      // console.log(chats);
      dispatch({ type: "loaded-messages", payload: chats });
    };
    fetchAndSetChats();
  }, []);

  const addNewChat = (data) => {
    dispatch({ type: "new-chat", payload: data });
  };

  const addMessage = (data) => {
    dispatch({ type: "new-message", payload: data });
  };
  return (
    <div>
      <BrowserRouter>
        <Suspense fallback={"Loading"}>
          {loggedIn ? (
            <SocketContextProvider id={user.id}>
              <Header />
              <Routes>
                <Route path="/" element={<Home chats={chats} />} />
                <Route
                  path="/chats"
                  element={
                    <ChatsContainer
                      chats={chats}
                      addNewChat={addNewChat}
                      addMessage={addMessage}
                    />
                  }
                />
                <Route
                  path="/chats/:id"
                  element={
                    <ChatsContainer
                      chats={chats}
                      addNewChat={addNewChat}
                      addMessage={addMessage}
                    />
                  }
                />
                <Route
                  path="/contacts"
                  element={<Contacts chats={chats} dispatch={dispatch} />}
                />
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

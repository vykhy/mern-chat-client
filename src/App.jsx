import React, { Suspense, useState, lazy, useEffect, useReducer } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { useAuthContext } from "./contexts/authContext";
import { useSocket } from "./contexts/socketContext";
import useAxiosPrivate from "./hooks/useAxiosPrivate";
import chatReducer from "./reducers/chatReducer";
import Header from "./components/Header";

const Home = lazy(() => import("./pages/Home"));
const Contacts = lazy(() => import("./pages/Contacts"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const AddContact = lazy(() => import("./pages/AddContact"));
const ChatsContainer = lazy(() => import("./pages/ChatsContainer"));
const Profile = lazy(() => import("./pages/Profile"));
const EditProfileImage = lazy(() => import("./pages/EditProfileImage"));
const EditProfile = lazy(() => import("./pages/EditProfile"));

const App = () => {
  const { user, accessToken, removeUser, removeToken } = useAuthContext();
  const [currentChatId, setCurrentChatId] = useState(null);
  const [unopenedChats, setUnopenedChats] = useState(0);
  const { socket } = useSocket();
  const axiosPrivate = useAxiosPrivate();
  const loggedIn = user !== null;

  const [chats, dispatch] = useReducer(chatReducer, []);

  // verify token found in localStorage upon loading
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
        const result = await axiosPrivate.get(
          process.env.REACT_APP_DEV_SERVER_URL + "/auth/verify"
        );
      } catch (err) {
        removeToken();
        removeUser();
      }
    };
    verifyTokenFoundInStorage();
  }, [user, accessToken, axiosPrivate, removeToken, removeUser]);

  // fetch and set chats
  useEffect(() => {
    if (!loggedIn) return;
    const fetchAndSetChats = async () => {
      // fetch chats
      const response = await axiosPrivate.get(
        process.env.REACT_APP_DEV_SERVER_URL + "/chats"
      );
      const chats = response.data.chats;
      // fetch contacts
      const contactResponse = await axiosPrivate.get(
        process.env.REACT_APP_DEV_SERVER_URL + "/contacts"
      );
      const contacts = contactResponse.data.contacts;
      // map chat to contacts
      chats.forEach((chat) => {
        // remove current user from chat users list
        chat.users = chat.users.find((tuser) => tuser._id !== user.id);
        // set chat contact
        const contact =
          contacts.find(
            (contact) =>
              // find chat where user id of contact and chat match
              chat.users._id === contact.contactId._id
          ) || null;
        chat.contact = contact?.name || null;
      });
      // console.log(contacts);
      dispatch({ type: "loaded-messages", payload: chats });
    };
    fetchAndSetChats();
  }, [axiosPrivate, loggedIn, user]);

  // goes through chats and marks messages received when user was offline as delivered
  useEffect(() => {
    if (!socket) return;
    setUnopenedChats(0); // reset unopened chats whenever we loop and calculate again
    chats.forEach((chat) => {
      for (let i = chat.messages.length - 1; i >= 0; i--) {
        // if the last message in the chat is unread and was not created by this user
        // then we increase the count of unponed chats
        if (
          chat.messages[i].read === null &&
          i === chat.messages.length - 1 &&
          chat.messages[i].authorId !== user.id
        ) {
          setUnopenedChats((prev) => prev + 1);
        }
        if (
          chat.messages[i].delivered === null && //message not marked as delivered
          chat.messages[i].authorId !== user.id //message was not sent by self
        ) {
          const now = new Date(Date.now());
          chat.messages[i].delivered = now;
          chat.messages[i]["time"] = now;
          socket.emit("message-delivered", chat.messages[i]);
          chat.messages[i].time = null;
        } else if (
          chat.messages[i].delivered && //if message marked as delivered
          chat.messages[i].authorId !== user.id //and message not sent by self
        ) {
          break;
        }
      }
    });
  }, [socket, chats]);
  // socket event handlers
  useEffect(() => {
    if (!user?.id) return;

    socket?.on("new-message", (data) => handleNewMessage(data));
    socket?.on("message-sent", (data) => handleMessageSent(data));
    socket?.on("new-chat-message", (data) => handleNewChat(data));
    socket?.on("marked-as-read", (data) => handleMarkedAsRead(data));
    socket?.on("marked-as-delivered", (data) => handleMarkedAsDelivered(data));

    return () => {
      socket?.off("new-message");
      socket?.off("message-sent");
      socket?.off("new-chat-message");
      socket?.off("marked-as-read");
      socket?.off("marked-as-delivered");
    };
  }, [user, socket]);
  // function to scroll to the bottom of a chat
  const scrollToBottom = () => {
    const element = document.getElementById("messageContainer");
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  };
  const handleNewChat = async (data) => {
    const chat = data.chat;
    console.log("new-chat");
    const message = data.message;
    if (chats.find((chat) => chat._id === data.chat._id)) {
      addMessage(message);
      return;
    } else {
      const contact = await axiosPrivate.get(`/contacts/${message.authorId}`);
      chat.contact = contact.data.name;
      message.delivered = new Date(Date.now());
      chat.messages = [message];

      chat.users = chat.users.find(
        (user) => user._id.valueOf() === message.authorId
      );
      message.time = message.delivered;
      socket?.emit("message-delivered", message);
      addNewChat(chat);
    }
  };
  const handleScroll = (data) => {
    const element = document.getElementById("messageContainer");
    if (element && element.scrollHeight - element.scrollTop < 1500) {
      if (currentChatId === data.chatId) {
        setTimeout(() => {
          scrollToBottom();
        }, 200);
      }
    }
  };
  const handleNewMessage = (data) => {
    console.log("new-message");
    data.delivered = new Date(Date.now());
    addMessage(data);
    handleScroll(data);

    // emit to mark message as delivered
    data.time = data.delivered;
    socket?.emit("message-delivered", data);
  };
  const handleMessageSent = (data) => {
    console.log("message-sent");
    addMessage(data);
    handleScroll(data);
  };
  const handleMarkedAsRead = (data) => {
    console.log("mark as read");
    dispatch({ type: "mark-as-read", payload: data });
  };
  const handleMarkedAsDelivered = (data) => {
    console.log("mark as delivered");
    dispatch({ type: "mark-as-delivered", payload: data });
  };
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
            <>
              <Header unopenedChats={unopenedChats} />
              <Routes>
                <Route path="/" element={<Home chats={chats} />} />
                <Route
                  path="/chats/:id"
                  element={
                    <ChatsContainer
                      chats={chats}
                      scrollToBottom={scrollToBottom}
                      setCurrentChatId={setCurrentChatId}
                    />
                  }
                />
                <Route
                  path="/contacts"
                  element={<Contacts chats={chats} dispatch={dispatch} />}
                />
                <Route path="/contacts/add" element={<AddContact />} />
                <Route
                  path="/profile"
                  element={<Profile chats={chats} />}
                ></Route>
                <Route path="/profile/edit" element={<EditProfile />} />
                <Route
                  path="/profile/image"
                  element={<EditProfileImage img={user?.profilePicture} />}
                />
                <Route
                  path="/profile/:id"
                  element={<Profile chats={chats} />}
                ></Route>

                <Route path="*" element={<Home />} />
              </Routes>
            </>
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

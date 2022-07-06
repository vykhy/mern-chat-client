import { createContext, useState, useContext } from "react";

const AuthContext = createContext();
const authUser = JSON.parse(localStorage.getItem(`mern-chat-user`));
const access = JSON.parse(localStorage.getItem("mern-chat-access"));

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(authUser);
  const [accessToken, setAccessToken] = useState(access);

  // set user in context and local storage
  const setNewUser = (user) => {
    setUser(user);
    localStorage.setItem("mern-chat-user", JSON.stringify(user));
  };

  // remove user from context and local storage
  const removeUser = () => {
    setUser(null);
    localStorage.removeItem("mern-chat-user");
  };

  // update access token in context and local storage
  const updateTokens = (access) => {
    setAccessToken(access);
    localStorage.setItem("mern-chat-access", JSON.stringify(access));
  };
  // remove token from local storage
  const removeToken = () => {
    localStorage.removeItem("mern-chat-access");
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        setNewUser,
        removeUser,
        updateTokens,
        removeToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
export const useAuthContext = () => useContext(AuthContext);

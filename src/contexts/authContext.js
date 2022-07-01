import { createContext, useState, useContext } from "react";

const AuthContext = createContext();
const authUser = JSON.parse(localStorage.getItem(`mern-chat-user`));

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(authUser);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("mern-chat-access")
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("mern-chat-refresh")
  );

  const setNewUser = (user) => {
    setUser(user);
    localStorage.setItem("mern-chat-user", JSON.stringify(user));
  };

  const removeUser = () => {
    setUser(null);
    localStorage.removeItem("mern-chat-user");
  };

  const updateTokens = (access, refresh) => {
    setAccessToken(access);
    setRefreshToken(refresh);
    localStorage.setItem("mern-chat-access", access);
    localStorage.setItem("mern-chat-refresh", refresh);
  };
  const removeTokens = () => {
    updateTokens(null, null);
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        setNewUser,
        removeUser,
        updateTokens,
        removeTokens,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
export const useAuthContext = () => useContext(AuthContext);

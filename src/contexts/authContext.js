import { createContext, useState, useContext } from "react";

const AuthContext = createContext();
const authUser = localStorage.getItem(`mern-chat-user`);

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(authUser);

  const setNewUser = (user) => {
    setUser(user);
    localStorage.setItem("mern-chat-user", user);
  };

  const removeUser = () => {
    setUser(null);
    localStorage.removeItem("mern-chat-user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setNewUser,
        removeUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
export const useAuthContext = () => useContext(AuthContext);

import { useContext, createContext, useEffect, useState } from "react";
import socketio from "socket.io-client";
import { useAuthContext } from "./authContext";

export const SocketContext = createContext();

function SocketContextProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const { user } = useAuthContext();

  useEffect(() => {
    if (user === null) return;
    const newSocket = socketio.connect(process.env.SOCKET_URL, {
      query: {
        userId: user.id,
      },
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
export default SocketContextProvider;

import { useContext, createContext, useEffect, useState } from "react";
import socketio from "socket.io-client";

export const SocketContext = createContext();

function SocketContextProvider({ id, children }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = socketio.connect(process.env.SOCKET_URL);
    setSocket(newSocket);

    return () => {
      socket.disconnect();
    };
  }, [id]);
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
export default SocketContextProvider;

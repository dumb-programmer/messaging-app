import { useEffect, useState } from "react";
import io from "socket.io-client";
import PropTypes from "prop-types";
import SocketContext from "../context/SocketContext";
import useAuthContext from "../hooks/useAuthContext";

const SocketProvider = ({ children }) => {
  const { auth } = useAuthContext();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = new io("http://localhost:3001/", {
      extraHeaders: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [auth.token]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

SocketProvider.propTypes = {
  children: PropTypes.node,
};

export default SocketProvider;

import { useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { io } from "socket.io-client";
import SocketContext from "../context/SocketContext";
import useAuthContext from "../hooks/useAuthContext";

const SocketProvider = ({ children }) => {
  const { auth } = useAuthContext();

  const socket = useMemo(
    () =>
      io("http://localhost:3001/", {
        extraHeaders: {
          Authorization: `Bearer ${auth.token}`,
        },
        autoConnect: false,
      }),
    [auth.token]
  );

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

SocketProvider.propTypes = {
  children: PropTypes.node,
};

export default SocketProvider;

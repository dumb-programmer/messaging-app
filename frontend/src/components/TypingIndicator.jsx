import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import useSocketContext from "../hooks/useSocketContext";

const TypingIndicator = ({ name, selectedUserId }) => {
  const socket = useSocketContext();
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const onTyping = (userId) => {
      if (userId === selectedUserId) {
        setIsTyping(true);
      }
    };
    socket?.on("typing", onTyping);
    return () => {
      socket?.off("typing", onTyping);
    };
  }, [socket, selectedUserId]);

  useEffect(() => {
    let timeout = null;
    if (isTyping) {
      timeout = setTimeout(() => setIsTyping(false), 2000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [isTyping]);

  if (!isTyping) {
    return null;
  }

  return (
    <p className="typing-indicator">
      {name} is typing
      <span>
        <span className="dot-one"></span> <span className="dot-two"></span>{" "}
        <span className="dot-three"></span>
      </span>
    </p>
  );
};

TypingIndicator.propTypes = {
  name: PropTypes.string,
  selectedUserId: PropTypes.string,
};

export default TypingIndicator;

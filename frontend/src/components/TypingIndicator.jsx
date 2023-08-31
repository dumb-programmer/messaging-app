import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import useSocketContext from "../hooks/useSocketContext";

const TypingIndicator = ({ name }) => {
  const socket = useSocketContext();
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    socket?.on("typing", () => {
      setIsTyping(true);
    });

    return () => {
      socket?.off("typing");
    };
  }, [socket]);

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
};

export default TypingIndicator;

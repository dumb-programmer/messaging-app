import { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import useApi from "../hooks/useApi";
import getMessages from "../api/getMessages";
import useAuthContext from "../hooks/useAuthContext";
import getRelativeDate from "../utils/getRelativeDate";
import SendIcon from "../icons/SendIcon";
import sendMessage from "../api/sendMessage";
import useSocketContext from "../hooks/useSocketContext";
import TypingIndicator from "./TypingIndicator";
import ChatHeader from "./ChatHeader";
import "../styles/Chatbox.css";

const Chatbox = ({ user, updateLatestMessages, onBack }) => {
  const { auth } = useAuthContext();
  const socket = useSocketContext();
  const { data, setData, loading, error } = useApi(
    () => getMessages(user._id, auth.token),
    [user._id]
  );
  const [message, setMessage] = useState("");
  const chatbodyRef = useRef();

  const onCreateMessage = async (e) => {
    e.preventDefault();
    await sendMessage({ to: user._id, content: message }, auth.token);
    setMessage("");
  };

  const scrollToBottom = useCallback(
    () => (chatbodyRef.current.scrollTop = chatbodyRef.current.scrollHeight),
    [chatbodyRef]
  );

  useEffect(() => {
    scrollToBottom();
  }, [data, scrollToBottom]);

  useEffect(() => {
    socket.on("new message", (message) => {
      setData((data) => ({
        ...data,
        messages: [...data.messages, message],
      }));
      updateLatestMessages({ latestMessage: { ...message, user } });
    });

    return () => {
      socket.off("new message");
    };
  }, [socket, setData, user, updateLatestMessages]);

  if (error) {
    return <div>Error</div>;
  }

  return (
    <div className="chatbox">
      <ChatHeader user={user} onBack={onBack} />
      <div className="chat-body" ref={chatbodyRef}>
        {loading && <p>Loading...</p>}
        {data &&
          data.messages.map((message) => (
            <div
              key={message._id}
              className={`message-container ${
                message.from.toString() === auth.user._id.toString()
                  ? "justify-end"
                  : ""
              }`}
            >
              <div
                className={`chat-message ${
                  message.from.toString() === auth.user._id.toString()
                    ? "chat-message__right"
                    : "chat-message__left"
                }`}
              >
                <span className="message-meta">
                  {getRelativeDate(new Date(message.createdAt))}
                </span>
                <p className="message-content">{message.content}</p>
              </div>
            </div>
          ))}
      </div>
      <div className="chat-footer">
        <TypingIndicator name={user.firstName} />
        <form onSubmit={onCreateMessage}>
          <div className="form-control">
            <input
              type="text"
              placeholder="Message"
              style={{ width: "100%" }}
              value={message}
              onChange={(e) => {
                socket.emit("typing", user._id);
                setMessage(e.target.value);
              }}
            />
          </div>
          <button type="submit" className="flex justify-center align-center">
            <SendIcon color="white" size={20} strokeWidth="2px" />
          </button>
        </form>
      </div>
    </div>
  );
};

Chatbox.propTypes = {
  user: PropTypes.object,
  updateLatestMessages: PropTypes.func,
  onBack: PropTypes.func,
};

export default Chatbox;

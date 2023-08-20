import { useCallback, useEffect, useRef, useState } from "react";
import {
  Link,
  useLocation,
  useOutletContext,
  useParams,
} from "react-router-dom";
import useApi from "../hooks/useApi";
import getMessages from "../api/getMessages";
import useAuthContext from "../hooks/useAuthContext";
import getRelativeDate from "../utils/getRelativeDate";
import LeftArrowIcon from "../icons/LeftArrowIcon";
import SendIcon from "../icons/SendIcon";
import sendMessage from "../api/sendMessage";
import useSocketContext from "../hooks/useSocketContext";
import "../styles/Chatbox.css";

const Chatbox = () => {
  const { userId } = useParams();
  const { state } = useLocation();
  const { auth } = useAuthContext();
  const socket = useSocketContext();
  const { updateLatestMessages } = useOutletContext();
  const { data, setData, loading, error } = useApi(
    () => getMessages(userId, auth.token),
    [userId]
  );
  const [message, setMessage] = useState("");
  const chatbodyRef = useRef();

  const onCreateMessage = async (e) => {
    e.preventDefault();
    await sendMessage({ to: userId, content: message }, auth.token);
    setMessage("");
  };

  const scrollToBottom = useCallback(
    () => (chatbodyRef.current.scrollTop = chatbodyRef.current.scrollHeight),
    [chatbodyRef]
  );

  useEffect(() => {
    scrollToBottom();
  });

  useEffect(() => {
    socket.on("new message", (message) => {
      setData((data) => ({
        ...data,
        messages: [...data.messages, message],
      }));
      updateLatestMessages({ latestMessage: { ...message, user: state.user } });
    });

    return () => {
      socket.off("new message");
    };
  }, [socket, setData, updateLatestMessages, state.user]);

  if (error) {
    return <div>Error</div>;
  }

  return (
    <div className="chatbox">
      <div className="chat-header">
        <Link to="/">
          <button
            className="flex justify-center align-center"
            aria-label="back"
          >
            <LeftArrowIcon
              aria-label="left arrow"
              color="grey"
              size={20}
              strokeWidth="2px"
            />
          </button>
        </Link>
        <div className="user-info">
          <img
            src={`http://localhost:3000/${state.user.avatar}`}
            className="avatar avatar-sm"
            alt="user avatar"
          />
          <div>
            <h3>{`${state.user.firstName} ${state.user.lastName}`}</h3>
            <span style={{ color: "grey" }}>@{state.user.username}</span>
          </div>
        </div>
      </div>
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
                <span>{getRelativeDate(new Date(message.createdAt))}</span>
                <p className="message-content">{message.content}</p>
              </div>
            </div>
          ))}
      </div>
      <div className="chat-footer">
        <form onSubmit={onCreateMessage}>
          <div className="form-control">
            <input
              type="text"
              placeholder="Message"
              style={{ width: "100%" }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
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

export default Chatbox;

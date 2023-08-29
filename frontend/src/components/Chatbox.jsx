import { useEffect } from "react";
import PropTypes from "prop-types";
import useApi from "../hooks/useApi";
import getMessages from "../api/getMessages";
import useAuthContext from "../hooks/useAuthContext";
import useSocketContext from "../hooks/useSocketContext";
import ChatHeader from "./ChatHeader";
import ChatFooter from "./ChatFooter";
import ChatBody from "./ChatBody";
import "../styles/Chatbox.css";

const Chatbox = ({
  user,
  updateLatestMessages,
  replaceLatestMessage,
  onBack,
}) => {
  const { auth } = useAuthContext();
  const socket = useSocketContext();
  const { data, setData, loading, error } = useApi(
    () => getMessages(user._id, auth.token),
    [user._id]
  );

  useEffect(() => {
    socket.on("new message", (message) => {
      setData((data) => ({
        ...data,
        messages: [...data.messages, message],
      }));
      updateLatestMessages({ latestMessage: { ...message, user } });
    });

    socket.on("delete message", (messageId) => {
      const previousMessage = data.messages[data.messages.length - 2];
      replaceLatestMessage({
        latestMessage: { ...previousMessage, user },
      });
      setData((data) => ({
        messages: data.messages.filter((message) => message._id !== messageId),
      }));
    });

    return () => {
      socket.off("new message");
      socket.off("delete message");
    };
  }, [data, socket, setData, user, updateLatestMessages, replaceLatestMessage]);

  if (error) {
    return <div>Error</div>;
  }

  return (
    <div className="chatbox">
      <ChatHeader user={user} onBack={onBack} />
      <ChatBody loading={loading} data={data} setData={setData} />
      <ChatFooter user={user} />
    </div>
  );
};

Chatbox.propTypes = {
  user: PropTypes.object,
  updateLatestMessages: PropTypes.func,
  replaceLatestMessage: PropTypes.func,
  onBack: PropTypes.func,
};

export default Chatbox;

import { useCallback, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import getMessages from "../api/getMessages";
import useAuthContext from "../hooks/useAuthContext";
import useSocketContext from "../hooks/useSocketContext";
import ChatHeader from "./ChatHeader";
import ChatFooter from "./ChatFooter";
import ChatBody from "./ChatBody";
import useInfiniteApi from "../hooks/useInfiniteApi";
import "../styles/Chatbox.css";

const Chatbox = ({
  user,
  updateLatestMessages,
  replaceLatestMessage,
  onBack,
}) => {
  const { auth } = useAuthContext();
  const socket = useSocketContext();
  const chatbodyRef = useRef();
  const { data, setData, loading, loadingMore, error } = useInfiniteApi(
    (page) => getMessages(user._id, auth.token, page),
    () => ((chatbodyRef.current.scrollTop = 45), [user._id])
  );

  const scrollToBottom = useCallback(
    () => (chatbodyRef.current.scrollTop = chatbodyRef.current.scrollHeight),
    [chatbodyRef]
  );

  useEffect(() => {
    socket?.on("new message", (message) => {
      setData((data) => ({
        ...data,
        messages: [...data.messages, message],
      }));
      updateLatestMessages({ latestMessage: { ...message, user } });
    });

    socket?.on("update message", ({ messageId, messageData }) => {
      const message = data.messages.filter(
        (message) => message._id === messageId
      )[0];
      replaceLatestMessage(message, {
        latestMessage: { ...message, ...messageData, user },
      });
      setData((data) => {
        const messages = data.messages.map((message) => {
          if (message._id === messageId) {
            return { ...message, ...messageData };
          }
          return message;
        });
        return { messages };
      });
    });

    socket?.on("delete message", (deletedMessage) => {
      // Get previous message
      const newMessage = data.messages[data.messages.length - 2] || [];
      replaceLatestMessage(deletedMessage, {
        latestMessage: { ...newMessage, user },
      });
      setData((data) => ({
        messages: data.messages.filter(
          (message) => message._id !== deletedMessage._id
        ),
      }));
    });

    socket?.on("delete file", (socketData) => {
      setData((data) => {
        const messages = data.messages.map((message) => {
          if (message._id === socketData.messageId) {
            const newFiles = message.files.filter(
              (file) => file !== socketData.file
            );
            message.files = newFiles;
          }
          return message;
        });
        return { messages };
      });
    });

    return () => {
      socket?.off("new message");
      socket?.off("update message");
      socket?.off("delete message");
      socket?.off("delete file");
    };
  }, [data, socket, setData, user, updateLatestMessages, replaceLatestMessage]);

  if (error) {
    return <div>Error</div>;
  }

  return (
    <div className="chatbox">
      <ChatHeader user={user} onBack={onBack} />
      <ChatBody
        loading={loading}
        loadingMore={loadingMore}
        data={data}
        chatbodyRef={chatbodyRef}
        scrollToBottom={scrollToBottom}
      />
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

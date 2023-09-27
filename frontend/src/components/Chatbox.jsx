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

const Chatbox = ({ user, replaceLatestMessage, onBack }) => {
  const { auth } = useAuthContext();
  const socket = useSocketContext();
  const chatbodyRef = useRef();
  const { data, setData, loading, loadingMore, error } = useInfiniteApi(
    useCallback(
      (page) => getMessages(user._id, auth.token, page),
      [user._id, auth.token]
    ),
    () => chatbodyRef.current.scrollBy({ top: 200, behavior: "smooth" })
  );

  const scrollToBottom = useCallback(() => {
    chatbodyRef.current.scrollBy({
      top: chatbodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatbodyRef]);

  useEffect(() => {
    const onNewMessage = (message) => {
      if (message.from === user._id || message.from === auth.user._id) {
        setData((data) => ({
          ...data,
          messages: [...data.messages, message],
        }));
        chatbodyRef.current.scrollBy({
          top: chatbodyRef.current.scrollHeight + 50,
          behavior: "smooth",
        });
      }
    };

    const onUpdateMessage = ({ messageId, messageData }) => {
      const message = data.messages.filter(
        (message) => message._id === messageId
      )[0];
      replaceLatestMessage(
        { messageId, messageData },
        {
          latestMessage: { ...message, ...messageData, user },
        }
      );
      setData((data) => {
        const messages = data.messages.map((message) => {
          if (message._id === messageId) {
            return { ...message, ...messageData };
          }
          return message;
        });
        return { messages };
      });
    };

    const onDeleteMessage = (deletedMessage) => {
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
    };

    const onDeleteFile = (socketData) => {
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
    };

    socket?.on("new message", onNewMessage);

    socket?.on("update message", onUpdateMessage);
    socket.on("delete message", onDeleteMessage);

    socket?.on("delete file", onDeleteFile);

    return () => {
      socket?.off("new message", onNewMessage);
      socket?.off("update message", onUpdateMessage);
      socket?.off("delete message", onDeleteMessage);
      socket?.off("delete file", onDeleteFile);
    };
  }, [
    data,
    socket,
    auth.user._id,
    user,
    scrollToBottom,
    setData,
    replaceLatestMessage,
  ]);

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
  replaceLatestMessage: PropTypes.func,
  onBack: PropTypes.func,
};

export default Chatbox;

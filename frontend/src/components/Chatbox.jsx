import { useCallback, useEffect, useMemo, useRef } from "react";
import PropTypes from "prop-types";
import getMessages from "../api/getMessages";
import useAuthContext from "../hooks/useAuthContext";
import useSocketContext from "../hooks/useSocketContext";
import ChatHeader from "./ChatHeader";
import ChatFooter from "./ChatFooter";
import ChatBody from "./ChatBody";
import useInfiniteApi from "../hooks/useInfiniteApi";
import "../styles/Chatbox.css";

const Chatbox = ({ user, onBack }) => {
  const { auth } = useAuthContext();
  const socket = useSocketContext();
  const chatbodyRef = useRef();
  const { data, setData, loading, loadingMore, error, loadMoreElementRef } =
    useInfiniteApi(
      useCallback(
        (page) => getMessages(user._id, auth.token, page),
        [user._id, auth.token]
      ),
      () => chatbodyRef.current.scrollBy({ top: 200, behavior: "smooth" })
    );

  const messages = useMemo(
    () =>
      data?.messages?.reduce((accumulator, currentMessage) => {
        accumulator[currentMessage?._id] = currentMessage;
        return accumulator;
      }, {}),
    [data]
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
        messages[message._id] = message;

        setData((data) => ({
          ...data,
          messages: [...Object.values(messages)],
        }));
        chatbodyRef.current.scrollBy({
          top: chatbodyRef.current.scrollHeight + 50,
          behavior: "smooth",
        });
      }
    };

    const onUpdateMessage = (message) => {
      if (message.from === user._id || message.from === auth.user._id) {
        messages[message._id] = message;

        setData((data) => {
          return { ...data, messages: [...Object.values(messages)] };
        });
      }
    };

    const onDeleteMessage = (message) => {
      if (message.from === user._id || message.from === auth.user._id) {
        delete messages[message._id];

        setData((data) => ({
          ...data,
          messages: [...Object.values(messages)],
        }));
      }
    };

    const onDeleteFile = (socketData) => {
      messages[socketData.messageId].files = messages[
        socketData.messageId
      ].files.filter((file) => file !== socketData.file);
      setData((data) => ({ ...data, messages: [...Object.values(messages)] }));
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
  }, [data, messages, socket, auth.user._id, user, scrollToBottom, setData]);

  if (error) {
    return <div>Error</div>;
  }

  return (
    <div className="chatbox">
      <ChatHeader user={user} onBack={onBack} />
      <ChatBody
        loading={loading}
        loadingMore={loadingMore}
        loadMoreElementRef={loadMoreElementRef}
        messages={
          messages &&
          Object.values(messages).sort(
            (m1, m2) => new Date(m1.createdAt) - new Date(m2.createdAt)
          )
        }
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

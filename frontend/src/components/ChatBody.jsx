import PropTypes from "prop-types";
import { useCallback, useEffect, useRef } from "react";
import MessagesSkeleton from "./MessagesSkeleton";
import Message from "./Message";

const ChatBody = ({ loading, data, setData }) => {
  const chatbodyRef = useRef();

  const scrollToBottom = useCallback(
    () => (chatbodyRef.current.scrollTop = chatbodyRef.current.scrollHeight),
    [chatbodyRef]
  );

  useEffect(() => {
    scrollToBottom();
  }, [data, scrollToBottom]);

  return (
    <div className="chat-body" ref={chatbodyRef}>
      {loading && <MessagesSkeleton />}
      {data &&
        data.messages.map((message) => (
          <Message
            key={message._id}
            message={message}
            updateMessage={(messageData, messageId) => {
              setData((data) => {
                const messages = data.messages.map((message) => {
                  if (message._id === messageId) {
                    return { ...message, ...messageData };
                  }
                  return message;
                });
                return { messages };
              });
            }}
          />
        ))}
    </div>
  );
};

ChatBody.propTypes = {
  data: PropTypes.object,
  loading: PropTypes.bool,
  setData: PropTypes.func,
};

export default ChatBody;

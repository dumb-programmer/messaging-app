import PropTypes from "prop-types";
import { useCallback, useEffect, useRef } from "react";
import MessagesSkeleton from "./MessagesSkeleton";
import Message from "./Message";

const ChatBody = ({ loading, data }) => {
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
          <Message key={message._id} message={message} />
        ))}
    </div>
  );
};

ChatBody.propTypes = {
  data: PropTypes.object,
  loading: PropTypes.bool,
};

export default ChatBody;

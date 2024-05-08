import PropTypes from "prop-types";
import { useEffect } from "react";
import MessagesSkeleton from "./MessagesSkeleton";
import Message from "./Message";
import Spinner from "./Spinner";

const ChatBody = ({
  loading,
  loadingMore,
  loadMoreElementRef,
  messages,
  chatbodyRef,
  scrollToBottom,
}) => {
  useEffect(() => {
    if (!loading) {
      scrollToBottom();
    }
  }, [scrollToBottom, loading]);

  return (
    <div className="chat-body" ref={chatbodyRef}>
      {loading && <MessagesSkeleton />}
      {loadingMore && (
        <div className="flex justify-center" style={{ paddingTop: 10 }}>
          <div
            className="flex centered"
            style={{
              backgroundColor: "var(--primary-clr)",
              height: 30,
              width: 30,
              borderRadius: "50%",
            }}
          >
            <Spinner size={20} color="white" strokeWidth={12} />
          </div>
        </div>
      )}
      <div ref={loadMoreElementRef}></div>
      {messages?.map((message) => (
        <Message key={message._id} message={message} />
      ))}
    </div>
  );
};

ChatBody.propTypes = {
  messages: PropTypes.array,
  loading: PropTypes.bool,
  loadingMore: PropTypes.bool,
  loadMoreElementRef: PropTypes.object,
  chatbodyRef: PropTypes.object,
  scrollToBottom: PropTypes.func,
};

export default ChatBody;

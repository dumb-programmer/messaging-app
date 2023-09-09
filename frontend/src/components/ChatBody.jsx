import PropTypes from "prop-types";
import { useEffect, useMemo } from "react";
import MessagesSkeleton from "./MessagesSkeleton";
import Message from "./Message";
import Spinner from "./Spinner";

const ChatBody = ({
  loading,
  loadingMore,
  data,
  chatbodyRef,
  scrollToBottom,
}) => {
  useEffect(() => {
    if (!loading) {
      scrollToBottom();
    }
  }, [scrollToBottom, loading]);

  const messages = useMemo(
    () =>
      data &&
      data.messages.sort(
        (m1, m2) => new Date(m1.createdAt) - new Date(m2.createdAt)
      ),
    [data]
  );

  return (
    <div className="chat-body" ref={chatbodyRef}>
      {loading && <MessagesSkeleton />}
      {loadingMore && (
        <div className="flex centered" style={{ paddingTop: 10 }}>
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
      <div className="load-more"></div>
      {messages?.map((message) => (
        <Message key={message._id} message={message} />
      ))}
    </div>
  );
};

ChatBody.propTypes = {
  data: PropTypes.object,
  loading: PropTypes.bool,
  loadingMore: PropTypes.bool,
  chatbodyRef: PropTypes.object,
  scrollToBottom: PropTypes.func,
};

export default ChatBody;

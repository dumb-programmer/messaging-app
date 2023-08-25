import PropTypes from "prop-types";
import getRelativeDate from "../utils/getRelativeDate";
import File from "./File";
import useAuthContext from "../hooks/useAuthContext";
import MessageDropdown from "./MessageDropdown";

const Message = ({ message }) => {
  const { auth } = useAuthContext();

  return (
    <div
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
        <div className="message-content">
          <p>{message.content}</p>
          {message.from === auth.user._id && (
            <MessageDropdown messageId={message._id} />
          )}
        </div>
        {message?.media?.map((item, idx) => (
          <File
            key={idx}
            item={item}
            isSender={message.from.toString() === auth.user._id.toString()}
          />
        ))}
      </div>
    </div>
  );
};

Message.propTypes = {
  message: PropTypes.object,
};

export default Message;

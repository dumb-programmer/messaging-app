import { useState } from "react";
import PropTypes from "prop-types";
import getRelativeDate from "../utils/getRelativeDate";
import File from "./File";
import useAuthContext from "../hooks/useAuthContext";
import MessageDropdown from "./MessageDropdown";
import EditMessage from "./EditMessage";

const Message = ({ message, updateMessage }) => {
  const { auth } = useAuthContext();
  const [edit, setEdit] = useState(false);

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
        {message.content && (
          <div className="message-content">
            {!edit ? (
              <>
                <p>{message.content}</p>
                {message.from === auth.user._id && (
                  <MessageDropdown
                    messageId={message._id}
                    onEdit={() => setEdit(true)}
                  />
                )}
              </>
            ) : (
              <EditMessage
                message={message}
                onSuccess={(data) => {
                  updateMessage(data, message._id);
                  setEdit(false);
                }}
                onCancel={() => setEdit(false)}
              />
            )}
          </div>
        )}
        <div>
          {message?.media?.map((item, idx) => (
            <File
              key={idx}
              isOwner={auth.user._id === message.from}
              messageId={message._id}
              item={item}
              onDelete={(file) => {
                const newFiles = message.media.filter(
                  (media) => media !== file
                );
                updateMessage({ media: newFiles }, message._id);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

Message.propTypes = {
  message: PropTypes.object,
  updateMessage: PropTypes.func,
};

export default Message;

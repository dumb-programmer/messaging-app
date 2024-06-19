import { useState } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import getRelativeDate from "../utils/getRelativeDate";
import File from "./File";
import useAuthContext from "../hooks/useAuthContext";
import MessageDropdown from "./MessageDropdown";
import EditMessageModal from "./EditMessageModal";

const Message = ({ message }) => {
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
            <p>{message.content}</p>
            {message.from === auth.user._id && (
              <MessageDropdown
                messageId={message._id}
                onEdit={() => setEdit(true)}
              />
            )}
          </div>
        )}
        <div>
          {message?.files?.map((file, idx) => (
            <File
              key={idx}
              isOwner={auth.user._id === message.from}
              messageId={message._id}
              name={file.name}
              item={file.url}
            />
          ))}
        </div>
        {edit &&
          createPortal(
            <EditMessageModal
              onCancel={() => setEdit(false)}
              onSuccess={() => setEdit(false)}
              message={message}
            />,
            document.querySelector("#root")
          )}
      </div>
    </div>
  );
};

Message.propTypes = {
  message: PropTypes.object,
};

export default Message;

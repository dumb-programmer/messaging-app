import PropTypes from "prop-types";
import getRelativeDate from "../utils/getRelativeDate";

const ChatMessage = ({ message, isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      key={message.latestMessage._id}
      title={
        message.latestMessage.content.length > 20
          ? message.latestMessage.content
          : null
      }
      className={`message flex ${isActive ? "active" : ""}`}
    >
      <img
        src={`http://localhost:3000/${message.latestMessage.user.avatar}`}
        className="avatar avatar-lg"
      />
      <div
        className="body flex justify-between align-center"
        style={{ flex: 2 }}
      >
        <div className="flex flex-column gap-sm">
          <h3>{`${message.latestMessage.user.firstName} ${message.latestMessage.user.lastName}`}</h3>
          <p className="text-sm">
            {message.latestMessage.content.length > 10
              ? `${message.latestMessage.content
                  .split("")
                  .slice(0, 20)
                  .join("")}...`
              : message.latestMessage.content}
          </p>
        </div>
        <p className="text-sm">{getRelativeDate(new Date(message.latestMessage.createdAt))}</p>
      </div>
    </div>
  );
};

ChatMessage.propTypes = {
  message: PropTypes.object,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
};

export default ChatMessage;

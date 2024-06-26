import PropTypes from "prop-types";
import LeftArrowIcon from "../icons/LeftArrowIcon";
import getRelativeDate from "../utils/getRelativeDate";

const ChatHeader = ({ user, onBack }) => {
  const { firstName, lastName, username, avatar, status, lastSeen } = user;

  return (
    <div className="chat-header">
      <button
        className="flex justify-center align-center"
        aria-label="back"
        onClick={onBack}
      >
        <LeftArrowIcon
          aria-label="left arrow"
          color="grey"
          size={20}
          strokeWidth="2px"
        />
      </button>
      <div className="user-info">
        <div className={`${status === "online" ? "online-indicator" : ""}`}>
          <img
            src={`http://localhost:3000/${avatar}`}
            className="avatar avatar-lg"
            alt="user avatar"
          />
        </div>
        <div className="flex flex-column gap-sm">
          <h3>{`${firstName} ${lastName}`}</h3>
          <p className="text-sm" style={{ color: "#607274" }}>@{username}</p>
          {status === "online" && (
            <p className="user-status user-online">Online</p>
          )}
          {status === "offline" && (
            <p className="user-status text-sm">
              Last Seen {getRelativeDate(new Date(lastSeen))}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

ChatHeader.propTypes = {
  user: PropTypes.object,
  onBack: PropTypes.func,
};

export default ChatHeader;

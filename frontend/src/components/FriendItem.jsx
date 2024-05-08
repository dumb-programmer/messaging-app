import ChatIcon from "../icons/ChatIcon";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const FriendItem = ({ friend, setSelectedFriend, setShowModal }) => {
  return (
    <div
      key={friend}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 40px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
        <img
          className="avatar avatar-lg"
          src={`http://localhost:3000/${friend.user.avatar}`}
        />
        <div>
          <p>{`${friend.user.firstName} ${friend.user.lastName}`}</p>
          <span style={{ color: "grey" }}>@{friend.user.username}</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Link
          aria-label="chat"
          className="btn"
          style={{ borderRadius: "50%", backgroundColor: "#eeeeee" }}
          to="/"
          state={{ user: friend.user }}
        >
          <ChatIcon size={20} color="gray" strokeWidth={2} />
        </Link>
        <button
          className="btn"
          style={{
            border: "1px solid var(--danger-clr)",
            color: "var(--danger-clr)",
          }}
          onClick={() => {
            setSelectedFriend(friend);
            setShowModal(true);
          }}
        >
          Unfriend
        </button>
      </div>
    </div>
  );
};

FriendItem.propTypes = {
  friend: PropTypes.object,
  setSelectedFriend: PropTypes.func,
  setShowModal: PropTypes.func,
};

export default FriendItem;

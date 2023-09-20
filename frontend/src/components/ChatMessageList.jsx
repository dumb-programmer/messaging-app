import PropTypes from "prop-types";
import ChatMessage from "./ChatMessage";

const ChatMessageList = ({ messages, selectedUser, setSelectedUser }) => {
  if (!messages) {
    return null;
  }
  return messages.map((message) => (
    <ChatMessage
      key={message._id}
      isActive={selectedUser?._id === message.latestMessage.user._id}
      onClick={() => setSelectedUser(message.latestMessage.user)}
      message={message}
    />
  ));
};

ChatMessageList.propTypes = {
  messages: PropTypes.array,
  selectedUser: PropTypes.object,
  setSelectedUser: PropTypes.func,
};

export default ChatMessageList;

import { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import useApi from "../hooks/useApi";
import getMessages from "../api/getMessages";
import useAuthContext from "../hooks/useAuthContext";
import SendIcon from "../icons/SendIcon";
import sendMessage from "../api/sendMessage";
import useSocketContext from "../hooks/useSocketContext";
import TypingIndicator from "./TypingIndicator";
import ChatHeader from "./ChatHeader";
import FileUpload from "./FileUpload";
import FilesPreview from "./FilesPreview";
import Message from "./Message";
import "../styles/Chatbox.css";
import MessagesSkeleton from "./MessagesSkeleton";

const Chatbox = ({ user, updateLatestMessages, onBack }) => {
  const { auth } = useAuthContext();
  const socket = useSocketContext();
  const { data, setData, loading, error } = useApi(
    () => getMessages(user._id, auth.token),
    [user._id]
  );
  const [message, setMessage] = useState("");
  const chatbodyRef = useRef();
  const [filesPreview, setFilesPreview] = useState([]);
  const [file, setFile] = useState([]);

  const onCreateMessage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("to", user._id);
    formData.append("content", message);
    file.forEach((file) => formData.append("media", file.file));
    await sendMessage(formData, auth.token);
    setFile([]);
    setFilesPreview([]);
    setMessage("");
  };

  const scrollToBottom = useCallback(
    () => (chatbodyRef.current.scrollTop = chatbodyRef.current.scrollHeight),
    [chatbodyRef]
  );

  useEffect(() => {
    scrollToBottom();
  }, [data, scrollToBottom]);

  useEffect(() => {
    socket.on("new message", (message) => {
      setData((data) => ({
        ...data,
        messages: [...data.messages, message],
      }));
      updateLatestMessages({ latestMessage: { ...message, user } });
    });

    socket.on("delete message", (messageId) => {
      setData((data) => ({
        messages: data.messages.filter((message) => message._id !== messageId),
      }));
    });

    return () => {
      socket.off("new message");
      socket.off("delete message");
    };
  }, [socket, setData, user, updateLatestMessages]);

  if (error) {
    return <div>Error</div>;
  }

  return (
    <div className="chatbox">
      <ChatHeader user={user} onBack={onBack} />
      <div className="chat-body" ref={chatbodyRef}>
        {loading && <MessagesSkeleton />}
        {data &&
          data.messages.map((message) => (
            <Message
              key={message._id}
              message={message}
              updateMessage={(messageData, messageId) => {
                setData((data) => {
                  const messages = data.messages.map((message) => {
                    if (message._id === messageId) {
                      return { ...message, ...messageData };
                    }
                    return message;
                  });
                  return { messages };
                });
              }}
            />
          ))}
        {filesPreview.length > 0 && (
          <FilesPreview
            files={filesPreview}
            removeFile={(fileId) => {
              setFilesPreview((files) =>
                files.filter((file) => file.id !== fileId)
              );
              setFile((files) => files.filter((file) => file.id !== fileId));
            }}
            resetFiles={() => {
              setFilesPreview([]);
              setFile([]);
            }}
          />
        )}
      </div>
      <div className="chat-footer">
        <TypingIndicator name={user.firstName} />
        <form onSubmit={onCreateMessage}>
          <div className="form-control">
            <input
              type="text"
              placeholder="Message"
              style={{ width: "100%" }}
              value={message}
              onChange={(e) => {
                socket.emit("typing", user._id);
                setMessage(e.target.value);
              }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              right: 0,
            }}
          >
            <FileUpload
              addFile={(newPreview, newMedia) => {
                const id = crypto.randomUUID();
                setFilesPreview((previews) => [
                  ...previews,
                  { id, preview: newPreview },
                ]);
                setFile((file) => [...file, { id, file: newMedia }]);
              }}
            />
            <button type="submit" className="flex justify-center align-center">
              <SendIcon color="white" size={20} strokeWidth={2} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

Chatbox.propTypes = {
  user: PropTypes.object,
  updateLatestMessages: PropTypes.func,
  onBack: PropTypes.func,
};

export default Chatbox;

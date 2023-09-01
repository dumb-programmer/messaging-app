import { useState } from "react";
import PropTypes from "prop-types";
import SendIcon from "../icons/SendIcon";
import FileUpload from "./FileUpload";
import TypingIndicator from "./TypingIndicator";
import useSocketContext from "../hooks/useSocketContext";
import sendMessage from "../api/sendMessage";
import useAuthContext from "../hooks/useAuthContext";
import FilesPreview from "./FilesPreview";

const ChatFooter = ({ user }) => {
  const [message, setMessage] = useState("");
  const [filesPreview, setFilesPreview] = useState([]);
  const [file, setFile] = useState([]);
  const socket = useSocketContext();
  const { auth } = useAuthContext();

  const onCreateMessage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("to", user._id);
    formData.append("content", message);
    file.forEach((file) => formData.append("files", file.file));
    await sendMessage(formData, auth.token);
    setFile([]);
    setFilesPreview([]);
    setMessage("");
  };

  return (
    <>
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
      <div className="chat-footer">
        <TypingIndicator name={user.firstName} />
        <form onSubmit={onCreateMessage}>
          <div className="form-control">
            <input
              type="text"
              placeholder="Message"
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
            <button
              type="submit"
              className="btn primary-btn flex justify-center align-center"
            >
              <SendIcon color="white" size={20} strokeWidth={2} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

ChatFooter.propTypes = {
  user: PropTypes.object,
};

export default ChatFooter;

import { useState } from "react";
import PropTypes from "prop-types";
import SendIcon from "../icons/SendIcon";
import FileUpload from "./FileUpload";
import TypingIndicator from "./TypingIndicator";
import useSocketContext from "../hooks/useSocketContext";
import sendMessage from "../api/sendMessage";
import useAuthContext from "../hooks/useAuthContext";
import FilesPreview from "./FilesPreview";
import TrashIcon from "../icons/TrashIcon";

const ChatFooter = ({ user }) => {
  const socket = useSocketContext();
  const { auth } = useAuthContext();

  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);

  const onCreateMessage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("to", user._id);
    formData.append("content", message);
    files.forEach((file) => formData.append("files", file.payload));
    await sendMessage(formData, auth.token);
    setFiles([]);
    setMessage("");
  };

  return (
    <>
      {files.length > 0 && (
        <FilesPreview
          files={files.map((file) => file.preview)}
          resetFiles={() => {
            setFiles([]);
          }}
        />
      )}
      <div className="chat-footer">
        <TypingIndicator name={user.firstName} selectedUserId={user._id} />
        <form onSubmit={onCreateMessage}>
          <div className="form-control">
            <input
              type="text"
              placeholder="Message"
              value={message}
              onChange={(e) => {
                socket?.emit("typing", user._id);
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
              addFile={(newFile, filePreview) => {
                const id = crypto.randomUUID();
                setFiles((file) => [
                  ...file,
                  {
                    id,
                    payload: newFile,
                    preview: (
                      <div style={{ position: "relative" }}>
                        <button
                          className="delete-file-btn"
                          aria-label="remove-file"
                          onClick={() => {
                            setFiles((files) =>
                              files.filter((file) => file.id !== id)
                            );
                          }}
                        >
                          <TrashIcon
                            size={15}
                            color="var(--danger-clr)"
                            strokeWidth={2}
                          />
                        </button>{" "}
                        {filePreview}
                      </div>
                    ),
                  },
                ]);
              }}
            />
          </div>
        </form>
        <button
          type="submit"
          className="btn primary-btn flex justify-center align-center"
        >
          <SendIcon color="white" size={20} strokeWidth={2} />
        </button>
      </div>
    </>
  );
};

ChatFooter.propTypes = {
  user: PropTypes.object,
};

export default ChatFooter;

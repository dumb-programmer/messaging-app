import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import useAuthContext from "../hooks/useAuthContext";
import getMedia from "../api/getMedia";
import DownloadIcon from "../icons/DownloadIcon";
import deleteMedia from "../api/deleteMedia";

const File = ({ messageId, item, onDelete }) => {
  const [file, setFile] = useState(null);
  const { auth } = useAuthContext();

  const handleFileDelete = async () => {
    try {
      await deleteMedia(item, { messageId }, auth.token);
      onDelete(item);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMedia(item, auth.token).then((res) =>
      res.blob().then((blob) => setFile(blob))
    );
  }, [item, auth.token]);

  if (!file) {
    return null;
  }

  if (file.type.split("/")[0] === "image") {
    return (
      <div className="message-media">
        <img
          src={URL.createObjectURL(file)}
          style={{ maxWidth: "100%", maxHeight: 200, objectFit: "contain" }}
        />
        <button onClick={handleFileDelete}>Delete</button>
      </div>
    );
  } else {
    return (
      <div
        className="message-content"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "10px 0",
        }}
      >
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <a href={URL.createObjectURL(file)}>
            <DownloadIcon size={20} color="white" strokeWidth={2} />
          </a>
          <p>{item.split("/")[3]}</p>
        </div>
        <button onClick={handleFileDelete}>Delete</button>
      </div>
    );
  }
};

File.propTypes = {
  messageId: PropTypes.string,
  item: PropTypes.string,
  onDelete: PropTypes.func,
};

export default File;

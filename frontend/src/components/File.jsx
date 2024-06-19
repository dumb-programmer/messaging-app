import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import useAuthContext from "../hooks/useAuthContext";
import DownloadIcon from "../icons/DownloadIcon";
import FileDropdown from "./FileDropdown";
import getFile from "../api/getFile";

const File = ({ isOwner, messageId, item, name }) => {
  const [file, setFile] = useState(null);
  const { auth } = useAuthContext();

  useEffect(() => {
    getFile(item, auth.token).then((res) =>
      res.blob().then((blob) =>
        setFile({
          url: URL.createObjectURL(blob),
          type: blob.type,
        })
      )
    );
  }, [item, auth?.token]);

  const DeleteBtn = useMemo(
    () => (isOwner ? <FileDropdown messageId={messageId} file={item} /> : null),
    [isOwner, messageId, item]
  );

  if (!file) {
    return null;
  }

  if (file.type.split("/")[0] === "image") {
    return (
      <div className="message-media">
        <img
          src={file.url}
          style={{ maxWidth: "100%", maxHeight: 200, objectFit: "contain" }}
        />
        {DeleteBtn}
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
          <a
            href={file.url}
            download={name}
            target="_blank"
            rel="noopener noreferrer"
          >
            <DownloadIcon size={20} color="white" strokeWidth={2} />
          </a>
          <p>{name}</p>
          {DeleteBtn}
        </div>
      </div>
    );
  }
};

File.propTypes = {
  isOwner: PropTypes.bool,
  messageId: PropTypes.string,
  item: PropTypes.string,
  name: PropTypes.string,
};

export default File;

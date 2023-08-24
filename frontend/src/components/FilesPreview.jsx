import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Carousal from "./Carousal";
import CrossIcon from "../icons/CrossIcon";
import TrashIcon from "../icons/TrashIcon";

const FilesPreview = ({ files, removeFile, resetFiles }) => {
  const [currentFileId, setCurrentFileId] = useState(null);

  return (
    <div className="files-preview">
      <button className="btn secondary-btn centered" onClick={resetFiles}>
        <CrossIcon size={20} strokeWidth={2} color="white" />
      </button>
      <div className="carousal-container">
        <button
          className="delete-file-btn"
          onClick={() => removeFile(currentFileId)}
        >
          <TrashIcon size={20} color="red" strokeWidth={2} />
        </button>
        <Carousal
          files={files}
          onChange={(fileId) => setCurrentFileId(fileId)}
        />
      </div>
    </div>
  );
};

FilesPreview.propTypes = {
  files: PropTypes.array,
  removeFile: PropTypes.func,
};

export default FilesPreview;

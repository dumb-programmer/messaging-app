import PropTypes from "prop-types";
import Carousal from "./Carousal";
import CrossIcon from "../icons/CrossIcon";

const FilesPreview = ({ files, resetFiles }) => {
  return (
    <div className="files-preview">
      <button className="btn secondary-btn centered" onClick={resetFiles}>
        <CrossIcon size={20} strokeWidth={2} color="white" />
      </button>
      <div className="carousal-container">
        <Carousal items={files} />
      </div>
    </div>
  );
};

FilesPreview.propTypes = {
  files: PropTypes.array,
  resetFiles: PropTypes.func,
};

export default FilesPreview;

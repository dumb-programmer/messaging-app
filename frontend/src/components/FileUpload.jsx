import { useRef } from "react";
import PropTypes from "prop-types";
import PaperClipIcon from "../icons/PaperClipIcon";
import GenericFilePreview from "./GenericFilePreview";

const FileUpload = ({ addFile }) => {
  const fileInputRef = useRef();

  const handleInput = (e) => {
    Array.from(e.target.files).forEach((file) => {
      const fileType = file.type.split("/")[0];
      let filePreview;
      if (fileType === "image") {
        filePreview = (
          <img src={URL.createObjectURL(file)} />
        );
      } else {
        filePreview = (
          <GenericFilePreview fileName={file.name} />
        );
      }
      addFile(file, filePreview);
    });
  };

  return (
    <>
      <button
        type="button"
        className="btn"
        onClick={() => fileInputRef.current.click()}
      >
        <PaperClipIcon size={20} color="grey" strokeWidth={2} />
      </button>
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: "none" }}
        onChange={handleInput}
        multiple
      />
    </>
  );
};

FileUpload.propTypes = {
  addFile: PropTypes.func,
};

export default FileUpload;

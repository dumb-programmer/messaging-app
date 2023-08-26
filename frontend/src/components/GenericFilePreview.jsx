import PropTypes from "prop-types";
import FileIcon from "../icons/FileIcon";

const GenericFilePreview = ({ fileName }) => {
  return (
    <div
      style={{
        backgroundColor: "#fff",
        padding: 100,
        borderRadius: 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <FileIcon color="grey" size={100} strokeWidth={1} />
      <p>{fileName}</p>
    </div>
  );
};

GenericFilePreview.propTypes = {
  fileName: PropTypes.string,
};

export default GenericFilePreview;

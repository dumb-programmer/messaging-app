import { useState } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import useToastContext from "../hooks/useToastContext";
import ToastType from "../constants/ToastType";
import ChevronDown from "../icons/ChevronDown";
import DeleteFileConfirmationModal from "./DeleteFileConfirmationModal";
import TrashIcon from "../icons/TrashIcon";

const FileDropdown = ({ messageId, file }) => {
  const [open, setOpen] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const Toast = useToastContext();

  return (
    <div className="message-actions-container">
      <button
        className="btn"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
      >
        <ChevronDown size={25} color="#eee" strokeWidth={2} />
      </button>
      {open && (
        <ul className="dropdown">
          <li onClick={() => setShowDeleteConfirmation(true)}>
            <TrashIcon strokeWidth={1.5} size={15} color={"black"} />
            Delete
          </li>
        </ul>
      )}
      {showDeleteConfirmation &&
        createPortal(
          <DeleteFileConfirmationModal
            file={file}
            messageId={messageId}
            onSuccess={() => {
              Toast.show({
                type: ToastType.SUCCESS,
                message: "File deleted",
                duration: 3000,
              });
              setShowDeleteConfirmation(false);
            }}
            onCancel={() => setShowDeleteConfirmation(false)}
          />,
          document.body
        )}
    </div>
  );
};

FileDropdown.propTypes = {
  messageId: PropTypes.string,
  file: PropTypes.string,
};

export default FileDropdown;

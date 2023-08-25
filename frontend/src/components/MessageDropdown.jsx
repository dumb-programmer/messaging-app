import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import MoreIcon from "../icons/MoreIcon";
import DeleteMessageConfirmationModal from "./DeleteMessageConfirmationModal";
import useToastContext from "../hooks/useToastContext";
import { createPortal } from "react-dom";

const MessageDropdown = ({ messageId }) => {
  const [open, setOpen] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const Toast = useToastContext();

  useEffect(() => {
    const onClick = () => setOpen(false);
    if (open) {
      window.addEventListener("click", onClick);
    }

    return () => {
      window.removeEventListener("click", onClick);
    };
  }, [open]);

  return (
    <div className="flex flex-column" style={{ position: "relative" }}>
      <button
        className="btn"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
      >
        <MoreIcon size={20} color="white" strokeWidth={2} />
      </button>
      {open && (
        <ul className="dropdown">
          <li>Edit</li>
          <li onClick={() => setShowDeleteConfirmation(true)}>Delete</li>
        </ul>
      )}
      {showDeleteConfirmation &&
        createPortal(
          <DeleteMessageConfirmationModal
            messageId={messageId}
            onSuccess={() => {
              Toast.show({
                type: Toast.SUCCESS,
                message: "Message deleted",
                duration: 3000,
              });
            }}
            onCancel={() => setShowDeleteConfirmation(false)}
          />,
          document.body
        )}
    </div>
  );
};

MessageDropdown.propTypes = {
  messageId: PropTypes.string,
};

export default MessageDropdown;

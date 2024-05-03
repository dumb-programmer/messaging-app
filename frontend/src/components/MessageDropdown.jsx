import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import DeleteMessageConfirmationModal from "./DeleteMessageConfirmationModal";
import useToastContext from "../hooks/useToastContext";
import ToastType from "../constants/ToastType";
import { createPortal } from "react-dom";
import TrashIcon from "../icons/TrashIcon";
import PenIcon from "../icons/PenIcon";
import ChevronDown from "../icons/ChevronDown";

const MessageDropdown = ({ messageId, onEdit }) => {
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
    <div className="message-actions-container">
      <button
        className="btn"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
      >
        <ChevronDown size={20} color="white" strokeWidth={2} />
      </button>
      {open && (
        <ul className="dropdown" style={{ right: 2 }}>
          <li onClick={onEdit}>
            <PenIcon size={15} color={"black"} strokeWidth={1.5} />
            Edit
          </li>
          <li onClick={() => setShowDeleteConfirmation(true)}>
            <TrashIcon size={15} color={"black"} strokeWidth={1.5} />
            Delete
          </li>
        </ul>
      )}
      {showDeleteConfirmation &&
        createPortal(
          <DeleteMessageConfirmationModal
            messageId={messageId}
            onSuccess={() => {
              Toast.show({
                type: ToastType.SUCCESS,
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
  onEdit: PropTypes.func,
};

export default MessageDropdown;

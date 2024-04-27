import PropTypes from "prop-types";
import Modal from "./Modal";
import DeleteFileConfirmationForm from "./DeleteFileConfirmationForm";

const DeleteFileConfirmationModal = ({
  file,
  messageId,
  onSuccess,
  onCancel,
}) => {
  return (
    <Modal>
      <DeleteFileConfirmationForm
        file={file}
        messageId={messageId}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    </Modal>
  );
};

DeleteFileConfirmationModal.propTypes = {
  file: PropTypes.string,
  messageId: PropTypes.string,
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func,
};

export default DeleteFileConfirmationModal;

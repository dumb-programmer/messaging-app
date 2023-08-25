import PropTypes from "prop-types";
import Modal from "./Modal";
import DeleteMessageConfirmationForm from "./DeleteMessageConfirmationForm";

const DeleteMessageConfirmationModal = ({ messageId, onSuccess, onCancel }) => {
  return (
    <Modal>
      <DeleteMessageConfirmationForm
        messageId={messageId}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    </Modal>
  );
};

DeleteMessageConfirmationModal.propTypes = {
  messageId: PropTypes.string,
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func,
};

export default DeleteMessageConfirmationModal;

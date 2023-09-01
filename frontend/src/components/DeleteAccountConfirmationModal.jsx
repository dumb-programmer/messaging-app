import PropTypes from "prop-types";
import Modal from "./Modal";
import DeleteAccountConfirmationForm from "./DeleteAccountConfirmationForm";

const DeleteAccountConfirmationModal = ({ onCancel, onSuccess }) => {
  return (
    <Modal>
      <DeleteAccountConfirmationForm
        onCancel={onCancel}
        onSuccess={onSuccess}
      />
    </Modal>
  );
};

DeleteAccountConfirmationModal.propTypes = {
  onCancel: PropTypes.func,
  onSuccess: PropTypes.func,
};

export default DeleteAccountConfirmationModal;

import Modal from "./Modal";
import EditMessageForm from "./EditMessageForm";
import PropTypes from "prop-types";

const EditMessageModal = ({ onCancel, onSuccess, message }) => {
  return (
    <Modal>
      <EditMessageForm
        onCancel={onCancel}
        onSuccess={onSuccess}
        message={message}
      />
    </Modal>
  );
};

EditMessageModal.propTypes = {
  onCancel: PropTypes.func,
  onSuccess: PropTypes.func,
  message: PropTypes.object,
};

export default EditMessageModal;

import PropTypes from "prop-types";
import ChangePasswordForm from "./ChangePasswordForm";
import Modal from "./Modal";

const ChangePasswordModal = ({ onCancel, onSuccess }) => {
  return (
    <Modal>
      <ChangePasswordForm onCancel={onCancel} onSuccess={onSuccess} />
    </Modal>
  );
};

ChangePasswordModal.propTypes = {
  onCancel: PropTypes.func,
  onSuccess: PropTypes.func,
};

export default ChangePasswordModal;

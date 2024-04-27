import PropTypes from "prop-types";
import Modal from "./Modal";
import UnfriendConfirmationForm from "./UnfriendConfirmationForm";

const UnfriendConfirmationModal = ({ selectedFriend, onSuccess, onCancel }) => {
  return (
    <Modal>
      <UnfriendConfirmationForm
        selectedFriend={selectedFriend}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    </Modal>
  );
};

UnfriendConfirmationModal.propTypes = {
  selectedFriend: PropTypes.object,
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func,
};

export default UnfriendConfirmationModal;

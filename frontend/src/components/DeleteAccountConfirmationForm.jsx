import PropTypes from "prop-types";
import deleteUser from "../api/deleteUser";
import useAuthContext from "../hooks/useAuthContext";

const DeleteAccountConfirmationForm = ({ onCancel, onSuccess }) => {
  const { auth, setAuth } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await deleteUser(auth.user._id, auth.token);
    setAuth(null);
    localStorage.clear();
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Delete Account</h2>
      <p>
        Are you sure you want to delete this account? This action is
        non-recoverable
      </p>
      <div className="flex justify-end gap-md">
        <button type="button" className="btn secondary-btn" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn danger-btn">
          Delete
        </button>
      </div>
    </form>
  );
};

DeleteAccountConfirmationForm.propTypes = {
  onCancel: PropTypes.func,
  onSuccess: PropTypes.func,
};

export default DeleteAccountConfirmationForm;

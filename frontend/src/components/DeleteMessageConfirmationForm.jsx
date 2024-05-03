import { useState } from "react";
import PropTypes from "prop-types";
import deleteMessage from "../api/deleteMessage";
import useAuthContext from "../hooks/useAuthContext";

const DeleteMessageConfirmationForm = ({ messageId, onSuccess, onCancel }) => {
  const { auth } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await deleteMessage(messageId, auth.token);
      onSuccess();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      style={{ padding: 10 }}
      onSubmit={loading ? (e) => e.preventDefault() : handleSubmit}
    >
      <h3>Delete Message</h3>
      <p className="text-sm" style={{ color: "#696969" }}>
        Are you sure you want to delete this message? this action is
        non-recoverable.
      </p>
      <div className="flex justify-end gap-md">
        <button className="btn secondary-btn" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
        <button type="submit" className="btn danger-btn" disabled={loading}>
          Yes
        </button>
      </div>
    </form>
  );
};

DeleteMessageConfirmationForm.propTypes = {
  messageId: PropTypes.string,
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func,
};

export default DeleteMessageConfirmationForm;

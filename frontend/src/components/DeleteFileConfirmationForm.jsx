import { useState } from "react";
import PropTypes from "prop-types";
import useAuthContext from "../hooks/useAuthContext";
import deleteFile from "../api/deleteFile";

const DeleteFileConfirmationForm = ({
  file,
  messageId,
  onSuccess,
  onCancel,
}) => {
  const { auth } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await deleteFile(file, { messageId }, auth.token);
      onSuccess();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={loading ? (e) => e.preventDefault() : handleSubmit}>
      <h2>Delete File</h2>
      <p>
        Are you sure you want to delete this file? this action is
        non-recoverable.
      </p>
      <div className="flex justify-end gap-md">
        <button onClick={onCancel} disabled={loading}>
          Cancel
        </button>
        <button type="submit" className="btn danger-btn" disabled={loading}>
          Yes
        </button>
      </div>
    </form>
  );
};

DeleteFileConfirmationForm.propTypes = {
  file: PropTypes.string,
  messageId: PropTypes.string,
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func,
};

export default DeleteFileConfirmationForm;

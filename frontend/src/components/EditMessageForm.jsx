import { useState } from "react";
import PropTypes from "prop-types";
import useAuthContext from "../hooks/useAuthContext";
import useToastContext from "../hooks/useToastContext";
import updateMessage from "../api/updateMessage";
import ToastType from "../constants/ToastType";

const EditMessageForm = ({ onCancel, onSuccess, message }) => {
  const { auth } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    content: message.content,
    media: message.media,
  });
  const Toast = useToastContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await updateMessage(message._id, data, auth.token);
      if (response.ok) {
        Toast.show({
          type: ToastType.SUCCESS,
          message: "Message updated",
          duration: 3000,
        });
        onSuccess();
      } else {
        Toast.show({
          type: ToastType.FAILURE,
          message: (await response.json()).message,
          duration: 3000,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      style={{ padding: 10 }}
      onSubmit={loading ? (e) => e.preventDefault() : handleSubmit}
    >
      <h3>Edit Message</h3>
      <div>
        <textarea
          style={{ width: "min(80vw, 500px)", height: 100 }}
          onChange={(e) =>
            setData((data) => ({ ...data, content: e.target.value }))
          }
          required
        >
          {data.content}
        </textarea>
      </div>
      <div className="flex justify-end gap-md">
        <button
          className="btn secondary-btn"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
        <button type="submit" className="btn primary-btn" disabled={loading}>
          Save
        </button>
      </div>
    </form>
  );
};

EditMessageForm.propTypes = {
  onCancel: PropTypes.func,
  onSuccess: PropTypes.func,
  message: PropTypes.object,
};

export default EditMessageForm;

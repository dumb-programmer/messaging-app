import PropTypes from "prop-types";
import { useState } from "react";
import updateMessage from "../api/updateMessage";
import useAuthContext from "../hooks/useAuthContext";
import useToastContext from "../hooks/useToastContext";

const EditMessage = ({ message, onSuccess, onCancel }) => {
  const [data, setData] = useState({
    content: message.content,
    media: message.media,
  });
  const { auth } = useAuthContext();
  const Toast = useToastContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateMessage(message._id, data, auth.token);
      if (response.ok) {
        Toast.show({
          type: Toast.SUCCESS,
          message: "Message updated",
          duration: 3000,
        });
        onSuccess();
      } else {
        Toast.show({
          type: Toast.FAILURE,
          message: (await response.json()).message,
          duration: 3000,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleTextInput = (e) => {
    setData({
      ...data,
      content: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ position: "relative" }}>
      <textarea
        onChange={handleTextInput}
        value={data.content}
        style={{ minHeight: 100 }}
      ></textarea>
      <div
        className="flex gap-md justify-end"
        style={{ position: "absolute", bottom: 10, right: 5 }}
      >
        <button
          className="btn secondary-btn"
          style={{ color: "black", fontSize: "0.7rem" }}
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button type="submit" className="btn primary-btn">
          Submit
        </button>
      </div>
    </form>
  );
};

EditMessage.propTypes = {
  message: PropTypes.object,
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func,
};

export default EditMessage;

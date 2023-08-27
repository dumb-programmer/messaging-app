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
        return onSuccess(data);
      }
      Toast.show({
        type: Toast.FAILURE,
        message: (await response.json()).message,
        duration: 3000,
      });
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
    <form onSubmit={handleSubmit}>
      <textarea onChange={handleTextInput} value={data.content}></textarea>
      <div className="flex gap-md justify-end">
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit">Submit</button>
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

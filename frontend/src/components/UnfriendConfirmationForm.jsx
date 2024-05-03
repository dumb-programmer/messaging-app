import PropTypes from "prop-types";
import unfriend from "../api/unfriend";
import useAuthContext from "../hooks/useAuthContext";

const UnfriendForm = ({ selectedFriend, onSuccess, onCancel }) => {
  const { auth } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await unfriend(selectedFriend._id, auth.token);
    if (response.ok) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: 10 }}>
      <h3>Unfriend</h3>
      <p className="break-word text-sm" style={{ color: "#696969" }}>
        Are you sure you want to unfriend{" "}
        {`${selectedFriend.user.firstName} ${selectedFriend.user.lastName}`},
        this action is non-reversable
      </p>
      <div className="flex justify-end gap-md">
        <button className="btn secondary-btn" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn danger-btn" type="submit">
          Yes
        </button>
      </div>
    </form>
  );
};

UnfriendForm.propTypes = {
  selectedFriend: PropTypes.object,
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func,
};

export default UnfriendForm;

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
    <form onSubmit={handleSubmit}>
      <h2>Unfriend</h2>
      <p className="break-word">
        Are you sure you want to unfriend{" "}
        {`${selectedFriend.user.firstName} ${selectedFriend.user.lastName}`},
        this action is non-reversable
      </p>
      <div className="flex justify-end gap-md">
        <button onClick={onCancel}>Cancel</button>
        <button type="submit">Yes</button>
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

import PropType from "prop-types";
import useAuthContext from "../hooks/useAuthContext";
import deleteRequest from "../api/deleteRequest";
import acceptRequest from "../api/acceptRequest";

const IncomingRequest = ({ request, onSuccess }) => {
  const { auth } = useAuthContext();

  const handleDecline = async () => {
    const response = await deleteRequest(request._id, auth.token);
    if (response.ok) {
      onSuccess(request._id);
    }
  };

  const handleAccept = async () => {
    const response = await acceptRequest(request._id, auth.token);
    if (response.ok) {
      onSuccess(request._id);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 40px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
        <img
          className="avatar"
          src={`http://localhost:3000/${request.from.avatar}`}
        />
        <div>
          <p>{`${request.from.firstName} ${request.from.lastName}`}</p>
          <span style={{ color: "grey" }}>@{request.from.username}</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <button onClick={handleDecline}>Decline</button>
        <button onClick={handleAccept}>Accept</button>
      </div>
    </div>
  );
};

IncomingRequest.propTypes = {
  request: PropType.object,
  onSuccess: PropType.func,
};

export default IncomingRequest;

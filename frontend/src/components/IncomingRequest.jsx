import PropType from "prop-types";
import useAuthContext from "../hooks/useAuthContext";
import deleteRequest from "../api/deleteRequest";
import acceptRequest from "../api/acceptRequest";
import useToastContext from "../hooks/useToastContext";
import ToastType from "../constants/ToastType";

const IncomingRequest = ({ request, onSuccess }) => {
  const { auth } = useAuthContext();
  const Toast = useToastContext();

  const handleDecline = async () => {
    const response = await deleteRequest(request._id, auth.token);
    if (response.ok) {
      onSuccess(request._id);
      Toast.show({
        type: ToastType.SUCCESS,
        message: "Request declined",
        duration: 3000,
      });
    }
  };

  const handleAccept = async () => {
    const response = await acceptRequest(request._id, auth.token);
    if (response.ok) {
      onSuccess(request._id);
      Toast.show({
        type: ToastType.SUCCESS,
        message: "Request accepted",
        duration: 3000,
      });
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
          className="avatar avatar-lg"
          src={`http://localhost:3000/${request.from.avatar}`}
        />
        <div className="flex flex-column gap-sm">
          <p>{`${request.from.firstName} ${request.from.lastName}`}</p>
          <p className="text-sm" style={{ color: "#607274" }}>
            @{request.from.username}
          </p>
        </div>
      </div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <button className="btn secondary-btn" onClick={handleDecline}>
          Decline
        </button>
        <button className="btn primary-btn" onClick={handleAccept}>
          Accept
        </button>
      </div>
    </div>
  );
};

IncomingRequest.propTypes = {
  request: PropType.object,
  onSuccess: PropType.func,
};

export default IncomingRequest;

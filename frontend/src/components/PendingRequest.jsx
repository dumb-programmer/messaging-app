import PropType from "prop-types";
import useAuthContext from "../hooks/useAuthContext";
import deleteRequest from "../api/deleteRequest";

const PendingRequest = ({ request, onSuccess }) => {
  const { auth } = useAuthContext();

  const handleCancel = async () => {
    const response = await deleteRequest(request._id, auth.token);
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
          className="avatar avatar-lg"
          src={`http://localhost:3000/${request.to.avatar}`}
        />
        <div className="flex flex-column gap-sm">
          <p>{`${request.to.firstName} ${request.to.lastName}`}</p>
          <p className="text-sm" style={{ color: "#607274" }}>
            @{request.to.username}
          </p>
        </div>
      </div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <button className="btn danger-btn" onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
};

PendingRequest.propTypes = {
  request: PropType.object,
  onSuccess: PropType.func,
};

export default PendingRequest;

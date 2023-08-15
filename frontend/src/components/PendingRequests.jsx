import getPendingRequests from "../api/getPendingRequest";
import useApi from "../hooks/useApi";
import useAuthContext from "../hooks/useAuthContext";
import PendingRequest from "./PendingRequest";
import RequestSkeleton from "./RequestSkeleton";

const PendingRequests = () => {
  const { auth } = useAuthContext();
  const { data, setData, loading, error } = useApi(() =>
    getPendingRequests(auth.token)
  );

  if (loading) {
    return <RequestSkeleton />;
  } else if (data) {
    return (
      <div>
        {data?.requests?.map((request) => (
          <PendingRequest
            key={request._id}
            request={request}
            onSuccess={(requestId) => {
              setData((data) => ({
                requests: data.requests.filter(
                  (request) => request._id !== requestId
                ),
              }));
            }}
          />
        ))}
        {data?.requests?.length === 0 && (
          <h1 style={{ textAlign: "center" }}>All Caught Up</h1>
        )}
      </div>
    );
  } else if (error) {
    return <p>Error</p>;
  }
};

export default PendingRequests;

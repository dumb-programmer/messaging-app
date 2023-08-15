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
        {data.requests.map((request) => (
          <PendingRequest
            key={request._id}
            request={request}
            filterRequest={(requestId) =>
              setData((data) => data.filter((data) => data._id !== requestId))
            }
          />
        ))}
      </div>
    );
  } else if (error) {
    return <p>Error</p>;
  }
};

export default PendingRequests;

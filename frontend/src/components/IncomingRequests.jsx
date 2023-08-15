import getIncomingRequests from "../api/getIncomingRequests";
import useApi from "../hooks/useApi";
import useAuthContext from "../hooks/useAuthContext";
import IncomingRequest from "./IncomingRequest";
import RequestSkeleton from "./RequestSkeleton";

const IncomingRequests = () => {
  const { auth } = useAuthContext();
  const { data, setData, loading, error } = useApi(() =>
    getIncomingRequests(auth.token)
  );

  if (loading) {
    return <RequestSkeleton />;
  } else if (data) {
    return (
      <div>
        {data.requests.map((request) => (
          <IncomingRequest
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

export default IncomingRequests;

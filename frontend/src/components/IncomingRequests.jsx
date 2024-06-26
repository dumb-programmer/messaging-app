import { useCallback } from "react";
import getIncomingRequests from "../api/getIncomingRequests";
import useInfiniteApi from "../hooks/useInfiniteApi";
import useAuthContext from "../hooks/useAuthContext";
import IncomingRequest from "./IncomingRequest";
import RequestSkeleton from "./RequestSkeleton";
import EmptyRequestsState from "./EmptyRequestsState";

const IncomingRequests = () => {
  const { auth } = useAuthContext();
  const { data, setData, loading, error, loadMoreElementRef } = useInfiniteApi(
    useCallback((page) => getIncomingRequests(auth.token, page), [auth])
  );

  if (loading || data) {
    return (
      <>
        {loading && <RequestSkeleton />}
        {data?.requests.map((request) => (
          <IncomingRequest
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
        <div ref={loadMoreElementRef}></div>
        {data?.requests.length === 0 && <EmptyRequestsState />}
      </>
    );
  } else if (error) {
    return <p>Error</p>;
  }
};

export default IncomingRequests;

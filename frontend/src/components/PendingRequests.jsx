import { useCallback } from "react";
import getPendingRequests from "../api/getPendingRequest";
import useInfiniteApi from "../hooks/useInfiniteApi";
import useAuthContext from "../hooks/useAuthContext";
import useToastContext from "../hooks/useToastContext";
import ToastType from "../constants/ToastType";
import EmptyState from "./EmptyState";
import PendingRequest from "./PendingRequest";
import RequestSkeleton from "./RequestSkeleton";

const PendingRequests = () => {
  const { auth } = useAuthContext();
  const { data, setData, loading, error } = useInfiniteApi(
    useCallback((page) => getPendingRequests(auth.token, page), [auth])
  );
  const Toast = useToastContext();

  if (loading || data) {
    return (
      <>
        {loading && <RequestSkeleton />}
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
              Toast.show({
                type: ToastType.SUCCESS,
                message: "Request Cancelled",
                duration: 3000,
              });
            }}
          />
        ))}
        {data?.requests?.length === 0 && <EmptyState />}
        <div className="load-more"></div>
      </>
    );
  } else if (error) {
    return <p>Error</p>;
  }
};

export default PendingRequests;

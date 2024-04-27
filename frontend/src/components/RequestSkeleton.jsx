import Skeleton from "react-loading-skeleton";

const RequestSkeleton = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: 20,
      }}
    >
      {Array.from({ length: 6 }).map((_, idx) => (
        <div
          key={idx}
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <div
            style={{
              width: "40%",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <Skeleton borderRadius={"50%"} height={70} width={70} />
            <div style={{ width: "100%" }}>
              <Skeleton width="100%" />
              <Skeleton width="60%" />
            </div>
          </div>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <Skeleton width={80} height={30} />
            <Skeleton width={80} height={30} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default RequestSkeleton;

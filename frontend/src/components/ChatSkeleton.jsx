import Skeleton from "react-loading-skeleton";

const ChatSkeleton = () => {
  return (
    <div style={{ width: "100%" }}>
      {Array.from({ length: 10 }).map((_, idx) => (
        <div
          className="flex gap-md align-center"
          style={{ marginBottom: 10, padding: 10 }}
          key={idx}
        >
          <div>
            <Skeleton borderRadius={"50%"} height={60} width={60} count={1} />
          </div>
          <div className="flex flex-column" style={{ flex: 2, gap: "0.2rem" }}>
            <Skeleton width={"80%"} />
            <Skeleton width={"70%"} />
            <Skeleton width={"60%"} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatSkeleton;

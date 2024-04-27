import Skeleton from "react-loading-skeleton";

const MessagesSkeleton = () => {
  return (
    <div style={{ width: "100%" }}>
      {Array.from({ length: 10 }).map((_, idx) => (
        <div
          className="flex gap-md align-center"
          style={{ marginBottom: 10, padding: 10 }}
          key={idx}
        >
          <div
            style={{ width: "100%" }}
            className={`flex ${
              Math.floor(Math.random() * 2) == 0
                ? "justify-end"
                : "jusitfy-start"
            }`}
          >
            <div>
              <Skeleton width={100} height={5} />
              <Skeleton
                width={Math.ceil((Math.random() * 500) % 500) + 100}
                height={50}
                style={{ borderRadius: 5, borderBottomLeftRadius: 20 }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessagesSkeleton;

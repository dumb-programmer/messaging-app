import conversation from "../../public/conversation.svg";

const EmptyContactList = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <img src={conversation} height={400} width={400} />
      <div
        style={{
          marginTop: -80,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <h3>Ready to Make New Connections?</h3>
        <p
          className="text-sm"
          style={{ color: "#607274", textAlign: "center" }}
        >
          {`Your contact list is looking a bit lonely! It's time to add some friends
          and start connecting.`}
        </p>
      </div>
    </div>
  );
};

export default EmptyContactList;

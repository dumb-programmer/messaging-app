import getLatestChats from "../api/getLatestChats";
import useAuthContext from "../hooks/useAuthContext";
import useApi from "../hooks/useApi";

const Chats = () => {
  const { auth } = useAuthContext();
  const { data, loading, error } = useApi(() => getLatestChats(auth.token));

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: 10 }}>
      <h2>Chats</h2>
      <div className="messages">
        {data?.messages?.map((message) => (
          <div className="message" key={message.latestMessage._id}>
            <img
              src={`http://localhost:3000/${message.latestMessage.user.avatar}`}
              className="avatar avatar-sm"
            />
            <div className="body">
              <h3>{`${message.latestMessage.user.firstName} ${message.latestMessage.user.lastName}`}</h3>
              <p>{message.latestMessage.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chats;

import getLatestChats from "../api/getLatestChats";
import useAuthContext from "../hooks/useAuthContext";
import useApi from "../hooks/useApi";
import getRelativeDate from "../utils/getRelativeDate";
import { NavLink, Outlet } from "react-router-dom";

const Chats = () => {
  const { auth } = useAuthContext();
  const { data, loading, error } = useApi(() => getLatestChats(auth.token));

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  return (
    <div className="flex" style={{ height: "100vh" }}>
      <div style={{ padding: 10, flex: 1 }}>
        <h2>Chats</h2>
        <div className="messages">
          {data?.messages?.map((message) => (
            <NavLink
              to={`/${message.latestMessage.user._id}`}
              key={message.latestMessage._id}
              className="message flex"
              state={{ user: message.latestMessage.user }}
            >
              <img
                src={`http://localhost:3000/${message.latestMessage.user.avatar}`}
                className="avatar avatar-sm"
              />
              <div
                className="body flex justify-between align-center"
                style={{ flex: 2 }}
              >
                <div>
                  <h3>{`${message.latestMessage.user.firstName} ${message.latestMessage.user.lastName}`}</h3>
                  <p>{message.latestMessage.content}</p>
                </div>
                <p>
                  {getRelativeDate(new Date(message.latestMessage.createdAt))}
                </p>
              </div>
            </NavLink>
          ))}
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default Chats;

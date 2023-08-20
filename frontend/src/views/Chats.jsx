import getLatestChats from "../api/getLatestChats";
import useAuthContext from "../hooks/useAuthContext";
import useApi from "../hooks/useApi";
import getRelativeDate from "../utils/getRelativeDate";
import { NavLink, Outlet } from "react-router-dom";
import { useCallback } from "react";

const sortMessagesByDate = (messages) =>
  messages.sort(
    (m1, m2) =>
      new Date(m2.latestMessage.createdAt) -
      new Date(m1.latestMessage.createdAt)
  );

const Chats = () => {
  const { auth } = useAuthContext();
  const { data, setData, loading, error } = useApi(() =>
    getLatestChats(auth.token)
  );

  const updateLatestMessages = useCallback(
    (newMessage) => {
      setData((data) => {
        const existingMessage = data.messages.filter(
          (message) =>
            message.latestMessage.user._id === newMessage.latestMessage.user._id
        )[0];
        if (existingMessage) {
          const index = data.messages.indexOf(existingMessage);
          data.messages[index] = newMessage;
          data.messages = sortMessagesByDate(data.messages);
          return { ...data };
        }

        const messages = sortMessagesByDate([...data.messages, newMessage]);
        return { messages };
      });
    },
    [setData]
  );

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
      <Outlet context={{ updateLatestMessages }} />
    </div>
  );
};

export default Chats;

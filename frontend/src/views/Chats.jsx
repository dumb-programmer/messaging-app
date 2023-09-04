import getLatestChats from "../api/getLatestChats";
import useAuthContext from "../hooks/useAuthContext";
import useApi from "../hooks/useApi";
import getRelativeDate from "../utils/getRelativeDate";
import { useLocation } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import useSocketContext from "../hooks/useSocketContext";
import ChatBox from "../components/Chatbox";
import ChatSkeleton from "../components/ChatSkeleton";
import useWidthObserver from "../hooks/useWidthObserver";

const sortMessagesByDate = (messages) =>
  messages.sort(
    (m1, m2) =>
      new Date(m2.latestMessage.createdAt) -
      new Date(m1.latestMessage.createdAt)
  );

const getDate = () => new Date().toISOString();

const Chats = () => {
  const { auth } = useAuthContext();
  const { data, setData, loading, error } = useApi(() =>
    getLatestChats(auth.token)
  );
  const { state } = useLocation();
  const [selectedUser, setSelectedUser] = useState(state?.user || null);
  const socket = useSocketContext();
  const containerRef = useRef();
  const { width } = useWidthObserver(containerRef);

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

  const replaceLatestMessage = useCallback(
    (previousMessage, newMessage) => {
      setData((data) => {
        const message = data.messages.filter(
          (message) => message.latestMessage._id === previousMessage._id
        )[0];
        if (message) {
          const index = data.messages.indexOf(message);
          data.messages[index] = newMessage;
          data.messages = sortMessagesByDate(data.messages);
          return { ...data };
        }
        return data;
      });
    },
    [setData]
  );

  const updateUser = useCallback(
    (user) => {
      const messages = sortMessagesByDate(
        data?.messages.map((message) => {
          if (message.latestMessage.user._id === user._id) {
            message.latestMessage = { ...message.latestMessage, user };
          }
          return message;
        })
      );
      setData({ messages });
    },
    [data, setData]
  );

  useEffect(() => {
    socket?.on("user status changed", (socketData) => {
      // Get the user whose status changed
      const user = data?.messages?.filter(
        (message) => message.latestMessage.user._id === socketData.userId
      )[0]?.latestMessage?.user;
      if (user) {
        const newUser = {
          ...user,
          status: socketData.type,
          lastSeen: getDate(),
        };
        updateUser(newUser);
        if (selectedUser?._id === newUser._id) {
          setSelectedUser(newUser);
        }
      }
    });

    return () => {
      socket?.off("user status changed");
    };
  }, [socket, updateUser, selectedUser, data]);

  return (
    <div className="flex" ref={containerRef} style={{ maxHeight: "100%" }}>
      <div
        className="chat-messages"
        style={{
          padding: selectedUser && width < 995 ? 0 : 10,
        }}
      >
        <h2>Chats</h2>
        <div className="messages">
          {loading && <ChatSkeleton />}
          {error && <div>Error</div>}
          {data?.messages?.map((message) => (
            <div
              onClick={() => setSelectedUser(message.latestMessage.user)}
              key={message.latestMessage._id}
              title={
                message.latestMessage.content.length > 20
                  ? message.latestMessage.content
                  : null
              }
              className={`message flex ${
                selectedUser?._id === message.latestMessage.user._id
                  ? "active"
                  : ""
              }`}
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
                  <p>
                    {message.latestMessage.content.length > 10
                      ? `${message.latestMessage.content
                          .split("")
                          .slice(0, 20)
                          .join("")}...`
                      : message.latestMessage.content}
                  </p>
                </div>
                <p>
                  {getRelativeDate(new Date(message.latestMessage.createdAt))}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedUser && (
        <ChatBox
          user={selectedUser}
          updateUser={updateUser}
          updateLatestMessages={updateLatestMessages}
          replaceLatestMessage={replaceLatestMessage}
          onBack={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default Chats;

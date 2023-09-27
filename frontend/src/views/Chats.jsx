import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import getLatestChats from "../api/getLatestChats";
import useAuthContext from "../hooks/useAuthContext";
import useApi from "../hooks/useApi";
import useSocketContext from "../hooks/useSocketContext";
import ChatBox from "../components/Chatbox";
import ChatSkeleton from "../components/ChatSkeleton";
import ChatMessageList from "../components/ChatMessageList";

const sortMessagesByDate = (messages) =>
  messages.sort(
    (m1, m2) =>
      new Date(m2.latestMessage.createdAt) -
      new Date(m1.latestMessage.createdAt)
  );

const getDate = () => new Date().toISOString();

const Chats = () => {
  const { auth } = useAuthContext();
  const { data, setData, loading, error } = useApi(
    useCallback(() => getLatestChats(auth.token), [auth.token])
  );
  const { state } = useLocation();
  const [selectedUser, setSelectedUser] = useState(state?.user || null);
  const socket = useSocketContext();

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
    const onUserStatusChanged = (socketData) => {
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
    };
    socket?.on("user status changed", onUserStatusChanged);

    return () => {
      socket?.off("user status changed", onUserStatusChanged);
    };
  }, [updateUser, selectedUser, data, socket]);

  useEffect(() => {
    const onNewMessage = (newMessage) => {
      const user = data?.messages?.filter(
        (message) =>
          message.latestMessage.user._id === newMessage.to ||
          message.latestMessage.user._id === newMessage.from
      )[0]?.latestMessage?.user;
      updateLatestMessages({ latestMessage: { ...newMessage, user } });
    };
    socket?.on("new message", onNewMessage);

    return () => {
      socket?.off("new message", onNewMessage);
    };
  }, [socket, data, updateLatestMessages]);

  return (
    <div className="flex" style={{ maxHeight: "100%" }}>
      <div className={`chat-messages ${selectedUser ? "chat__active" : ""}`}>
        <h2>Chats</h2>
        <div className="messages">
          {loading && <ChatSkeleton />}
          {error && <div>Error</div>}
          <ChatMessageList
            messages={data?.messages}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
          />
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

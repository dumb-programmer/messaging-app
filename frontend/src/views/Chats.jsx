import { useCallback, useEffect, useMemo, useState } from "react";
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

  const messages = useMemo(
    () =>
      data?.messages?.reduce((accumulator, currentVal) => {
        accumulator[currentVal?.latestMessage.user._id] = currentVal;
        return accumulator;
      }, {}),
    [data]
  );

  const addNewLatestMessage = useCallback(
    (newMessage) => {
      setData((data) => {
        messages[newMessage.user._id] = { latestMessage: newMessage };
        return { ...data, messages: Object.values(messages) };
      });
    },
    [setData, messages]
  );

  const replaceLatestMessage = useCallback(
    (newMessage, friendId) => {
      const message = messages[friendId];
      console.log(message);
      if (message) {
        messages[friendId] = {
          latestMessage: { ...newMessage, user: message.latestMessage.user },
        };
        setData((data) => ({ ...data, messages: Object.values(messages) }));
      }
    },
    [setData, messages]
  );

  const updateUser = useCallback(
    (user) => {
      messages[user._id] = {
        latestMessage: { ...messages[user._id].latestMessage, user },
      };
      setData((data) => ({ ...data, messages: Object.values(messages) }));
    },
    [setData, messages]
  );

  useEffect(() => {
    const onUserStatusChanged = (userData) => {
      const message = messages[userData.userId];
      if (message) {
        const newUser = {
          ...message.latestMessage.user,
          status: userData.type,
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
  }, [updateUser, selectedUser, messages, socket]);

  useEffect(() => {
    const onNewMessage = (newMessage) => {
      addNewLatestMessage(newMessage);
    };
    const onUpdateMessage = (updatedMessage, friendId) => {
      replaceLatestMessage(updatedMessage, friendId);
    };
    socket?.on("latest message", onNewMessage);
    socket?.on("update latest message", onUpdateMessage);

    return () => {
      socket?.off("latest message", onNewMessage);
      socket?.off("update latest message", onUpdateMessage);
    };
  }, [socket, data, addNewLatestMessage, replaceLatestMessage]);

  return (
    <div className="flex" style={{ height: "100%" }}>
      <div className={`chat-messages ${selectedUser ? "chat__active" : ""}`}>
        <h2 style={{ padding: 10 }}>Chats</h2>
        <div className="messages">
          {loading && <ChatSkeleton />}
          {error && <div>Error</div>}
          {!loading && !error && (
            <ChatMessageList
              messages={messages && sortMessagesByDate(Object.values(messages))}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
            />
          )}
        </div>
      </div>
      {selectedUser && (
        <ChatBox user={selectedUser} onBack={() => setSelectedUser(null)} />
      )}
    </div>
  );
};

export default Chats;

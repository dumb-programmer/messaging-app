import useAuthContext from "../hooks/useAuthContext";
import useApi from "../hooks/useApi";
import getFriends from "../api/getFriends";
import UnfriendConfirmationModal from "./UnfriendConfirmationModal";
import { useState } from "react";
import useToastContext from "../hooks/useToastContext";

const ContactList = () => {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { auth } = useAuthContext();
  const { data, setData, loading, error } = useApi(() =>
    getFriends(auth.token)
  );
  const Toast = useToastContext();

  if (loading) {
    return <p>Loading...</p>;
  } else if (data) {
    return (
      <>
        {data.friends.map((friend) => (
          <div
            key={friend._id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 40px",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}
            >
              <img
                className="avatar"
                src={`http://localhost:3000/${friend.user.avatar}`}
              />
              <div>
                <p>{`${friend.user.firstName} ${friend.user.lastName}`}</p>
                <span style={{ color: "grey" }}>@{friend.user.username}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button>Chat</button>
              <button
                onClick={() => {
                  setSelectedFriend(friend);
                  setShowModal(true);
                }}
              >
                Unfriend
              </button>
            </div>
          </div>
        ))}
        {showModal && (
          <UnfriendConfirmationModal
            selectedFriend={selectedFriend}
            onSuccess={() => {
              setData((data) => ({
                friends: data.friends.filter(
                  (friend) => friend._id !== selectedFriend._id
                ),
              }));
              setSelectedFriend(null);
              setShowModal(false);
              Toast.show({
                type: Toast.SUCCESS,
                message: "Removed friend",
                duration: 3000,
              });
            }}
            onCancel={() => setShowModal(false)}
          />
        )}
      </>
    );
  } else if (error) {
    return <p>Error</p>;
  }
};

export default ContactList;

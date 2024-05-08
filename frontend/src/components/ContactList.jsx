import { useCallback, useState } from "react";
import useAuthContext from "../hooks/useAuthContext";
import useInfiniteApi from "../hooks/useInfiniteApi";
import getFriends from "../api/getFriends";
import UnfriendConfirmationModal from "./UnfriendConfirmationModal";
import useToastContext from "../hooks/useToastContext";
import ToastType from "../constants/ToastType";
import FriendItem from "./FriendItem";

const ContactList = () => {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { auth } = useAuthContext();
  const { data, setData, loading, error, loadMoreElementRef } = useInfiniteApi(
    useCallback((page) => getFriends(auth.token, page), [auth.token])
  );
  const Toast = useToastContext();

  if (loading || data) {
    return (
      <>
        {loading && <p>Loading...</p>}
        {data?.friends.map((friend) => (
          <FriendItem
            key={friend._id}
            friend={friend}
            setShowModal={setShowModal}
            setSelectedFriend={setSelectedFriend}
          />
        ))}
        <div ref={loadMoreElementRef}></div>
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
                type: ToastType.SUCCESS,
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

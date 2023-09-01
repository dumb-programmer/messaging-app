import { useState } from "react";
import DeleteAccountConfirmationModal from "./DeleteAccountConfirmationModal";

const DeleteAccount = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div>
      <h2>Delete Account</h2>
      <button className="btn danger-btn" onClick={() => setShowModal(true)}>
        Delete Account
      </button>
      {showModal && (
        <DeleteAccountConfirmationModal
          onCancel={() => setShowModal(false)}
          onSuccess={() => {}}
        />
      )}
    </div>
  );
};

export default DeleteAccount;

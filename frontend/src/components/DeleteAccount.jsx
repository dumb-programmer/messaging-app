import { useState } from "react";
import DeleteAccountConfirmationModal from "./DeleteAccountConfirmationModal";

const DeleteAccount = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div style={{ marginTop: 10 }}>
      <h3>Delete Account</h3>
      <button
        className="btn danger-btn"
        style={{ marginTop: 10 }}
        onClick={() => setShowModal(true)}
      >
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

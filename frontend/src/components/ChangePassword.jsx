import { useState } from "react";
import ChangePasswordModal from "./ChangePasswordModal";
import useToastContext from "../hooks/useToastContext";

const ChangePassword = () => {
  const [showModal, setShowModal] = useState(false);
  const Toast = useToastContext();

  return (
    <>
      <h2>Password</h2>
      <button
        className="btn primary-btn"
        type="button"
        style={{ maxWidth: 200 }}
        onClick={() => setShowModal(true)}
      >
        Change Password
      </button>
      {showModal && (
        <ChangePasswordModal
          onCancel={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            Toast.show({
              type: Toast.SUCCESS,
              message: "Password updated",
              duration: 3000,
            });
          }}
        />
      )}
    </>
  );
};

export default ChangePassword;

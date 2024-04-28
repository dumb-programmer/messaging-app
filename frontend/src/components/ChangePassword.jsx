import { useState } from "react";
import ChangePasswordModal from "./ChangePasswordModal";
import useToastContext from "../hooks/useToastContext";
import ToastType from "../constants/ToastType";

const ChangePassword = () => {
  const [showModal, setShowModal] = useState(false);
  const Toast = useToastContext();

  return (
    <div style={{ marginTop: 10 }}>
      <h3>Password</h3>
      <button
        className="btn primary-btn"
        style={{ marginTop: 10 }}
        type="button"
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
              type: ToastType.SUCCESS,
              message: "Password updated",
              duration: 3000,
            });
          }}
        />
      )}
    </div>
  );
};

export default ChangePassword;

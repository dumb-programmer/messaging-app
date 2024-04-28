import { useState } from "react";
import PropTypes from "prop-types";
import Toasts from "./Toasts";
import ToastContext from "../context/ToastContext";
import "../styles/Toast.css";

const ToastsContainer = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const show = (newToast) => {
    const id = crypto.randomUUID();
    setToasts((toasts) => [...toasts, { id, ...newToast }]);
    setTimeout(() => {
      setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
    }, newToast.duration);
  };

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <Toasts toasts={toasts} />
    </ToastContext.Provider>
  );
};

ToastsContainer.propTypes = {
  children: PropTypes.node,
};

export default ToastsContainer;

import { useState } from "react";
import PropTypes from "prop-types";
import Toasts from "./Toasts";
import ToastContext from "../context/ToastContext";
import "../styles/Toast.css";

const types = {
  SUCCESS: "SUCCESS",
  FAILURE: "FAILURE",
};

const ToastsContainer = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const show = (newToast) => {
    setToasts((toasts) => [...toasts, newToast]);
    setTimeout(() => {
      setToasts((toasts) =>
        toasts.filter((toast) => toast._id !== newToast._id)
      );
    }, newToast.duration);
  };

  return (
    <ToastContext.Provider value={{ show, ...types }}>
      {children}
      <Toasts toasts={toasts} />
    </ToastContext.Provider>
  );
};

ToastsContainer.propTypes = {
  children: PropTypes.node,
};

export default ToastsContainer;

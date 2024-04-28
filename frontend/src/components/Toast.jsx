import PropTypes from "prop-types";
import AlertIcon from "../icons/AlertIcon";
import CheckIcon from "../icons/CheckIcon";
import { types as ToastType } from "../components/ToastsContainer";

const Toast = ({ type, message, duration }) => {
  const StatusIcon = () => {
    switch (type) {
      case ToastType.FAILURE:
        return (
          <AlertIcon size={24} color={"var(--danger-clr)"} strokeWidth="2px" />
        );
      case ToastType.SUCCESS:
        return <CheckIcon size={24} color={"green"} strokeWidth="2px" />;
    }
  };

  return (
    <div
      className={`toast ${
        type === ToastType.SUCCESS ? "toast-success" : "toast-failure"
      }`}
      style={{
        animation: `slide-in 100ms ease-out, slide-out 100ms ${
          duration - 100
        }ms ease-out`,
      }}
    >
      <StatusIcon />
      <p>{message}</p>
      <span
        className="progress-bar"
        style={{ animationDuration: `${duration + 900}ms` }}
      ></span>
    </div>
  );
};

Toast.propTypes = {
  type: PropTypes.string,
  message: PropTypes.string,
  duration: PropTypes.number,
};

export default Toast;

import PropTypes from "prop-types";
import useToastContext from "../hooks/useToastContext";
import AlertIcon from "../icons/AlertIcon";
import CheckIcon from "../icons/CheckIcon";

const Toast = ({ type, message, duration }) => {
  const ToastContext = useToastContext();

  const StatusIcon = () => {
    switch (type) {
      case ToastContext.FAILURE:
        return <AlertIcon size={24} color={"red"} strokeWidth="2px" />;
      case ToastContext.SUCCESS:
        return <CheckIcon size={24} color={"green"} strokeWidth="2px" />;
    }
  };

  return (
    <div
      className={`toast ${
        type === ToastContext.SUCCESS ? "toast-success" : "toast-failure"
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
        style={{ animationDuration: `${duration + 1000}ms` }}
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

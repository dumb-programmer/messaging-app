import PropTypes from "prop-types";
import Toast from "./Toast";

const Toasts = ({ toasts }) => {
  return (
    <div className="toasts-container">
      {toasts.map((toast, idx) => (
        <Toast
          key={idx}
          type={toast.type}
          message={toast.message}
          duration={toast.duration}
        />
      ))}
    </div>
  );
};

Toasts.propTypes = {
  toasts: PropTypes.array,
};

export default Toasts;

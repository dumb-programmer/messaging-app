import PropType from "prop-types";
import "../styles/Modal.css";

const Modal = ({ children }) => {
  return (
    <div className="modal-container">
      <div className="modal">{children}</div>
    </div>
  );
};

Modal.propTypes = {
  children: PropType.node,
};

export default Modal;

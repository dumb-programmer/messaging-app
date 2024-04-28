import PropType from "prop-types";

const CrossIcon = ({ size, color, strokeWidth }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="cross-icon"
      className="feather feather-cross"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
};

CrossIcon.propTypes = {
  size: PropType.number,
  color: PropType.string,
  strokeWidth: PropType.number,
};

export default CrossIcon;

import PropType from "prop-types";

const ChevronDown = ({ size, color, strokeWidth }) => {
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
      className="feather feather-chevron-left"
    >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );
};

ChevronDown.propTypes = {
  size: PropType.number,
  color: PropType.string,
  strokeWidth: PropType.number,
};

export default ChevronDown;

import PropType from "prop-types";

const ChevronRight = ({ size, color, strokeWidth }) => {
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
      aria-label="chevron-right-icon"
      className="feather feather-chevron-right"
    >
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );
};

ChevronRight.propTypes = {
  size: PropType.number,
  color: PropType.string,
  strokeWidth: PropType.number,
};

export default ChevronRight;

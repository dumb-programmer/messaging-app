import PropType from "prop-types";

const CheckIcon = ({ size, color, strokeWidth }) => {
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
      className="feather feather-success"
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
};

CheckIcon.propTypes = {
  size: PropType.number,
  color: PropType.string,
  strokeWidth: PropType.string,
};

export default CheckIcon;

import PropType from "prop-types";

const PenIcon = ({ size, color, strokeWidth }) => {
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
      className="feather feather-edit-2"
    >
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
    </svg>
  );
};

PenIcon.propTypes = {
  size: PropType.number,
  color: PropType.string,
  strokeWidth: PropType.string,
};

export default PenIcon;

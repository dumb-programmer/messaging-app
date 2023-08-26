import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import ChevronLeft from "../icons/ChevronLeft";
import ChevronRight from "../icons/ChevronRight";

const Carousal = ({ files, onChange }) => {
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    onChange(files[selected]?.id);
  }, [files, selected, onChange]);

  useEffect(() => {
    // When selected is out of range
    if (selected === files.length) {
      setSelected(files.length - 1);
    }
  }, [files, selected]);

  const onNext = () => {
    if (selected < files.length - 1) {
      const newSelected = selected + 1;
      setSelected(newSelected);
    }
  };

  const onPrevious = () => {
    if (selected > 0) {
      const newSelected = selected - 1;
      setSelected(newSelected);
    }
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        gap: "1rem",
        justifyItems: "center",
        alignItems: "center",
        maxHeight: "100%",
        maxWidth: "100%",
        flex: 2,
      }}
    >
      <button
        className="btn secondary-btn centered"
        onClick={onPrevious}
        disabled={selected === 0}
      >
        <ChevronLeft size={20} color="white" strokeWidth={2} />
      </button>
      {files[selected]?.preview}
      <button
        className="btn secondary-btn centered"
        onClick={onNext}
        disabled={selected === files.length - 1}
      >
        <ChevronRight size={20} color="white" strokeWidth={2} />
      </button>
    </div>
  );
};

Carousal.propTypes = {
  files: PropTypes.array,
  onChange: PropTypes.func,
};

export default Carousal;

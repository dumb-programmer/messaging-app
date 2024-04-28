import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import ChevronLeft from "../icons/ChevronLeft";
import ChevronRight from "../icons/ChevronRight";

const Carousal = ({ items }) => {
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    // When selected is out of range
    if (selected === items.length) {
      setSelected(items.length - 1);
    }
  }, [items, selected]);

  const onNext = () => {
    if (selected < items.length - 1) {
      setSelected((selected) => selected + 1);
    }
  };

  const onPrevious = () => {
    if (selected > 0) {
      setSelected((selected) => selected - 1);
    }
  };

  const hasNext = selected < items.length - 1;
  const hasPrevious = selected > 0;

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
      <div>
        {hasPrevious && (
          <button aria-label="previous item" className="btn centered" onClick={onPrevious}>
            <ChevronLeft size={20} color="white" strokeWidth={2} />
          </button>
        )}
      </div>
      {items[selected]}
      <div>
        {hasNext && (
          <button aria-label="next item" className="btn centered" onClick={onNext}>
            <ChevronRight size={20} color="white" strokeWidth={2} />
          </button>
        )}
      </div>
    </div>
  );
};

Carousal.propTypes = {
  items: PropTypes.array,
};

export default Carousal;

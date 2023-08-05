import { useState } from "react";
import PropTypes from "prop-types";
import "../styles/TabComponent.css";

const TabComponent = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="tab-component">
      <div className="tab-header">
        {tabs.map((tab, idx) => (
          <div
            key={idx}
            className={`tab${idx === activeTab ? " tab__active" : ""}`}
            onClick={() => setActiveTab(idx)}
          >
            {tab.label}
          </div>
        ))}
      </div>
      <div className="tab-body">{tabs[activeTab].body}</div>
    </div>
  );
};

TabComponent.propTypes = {
  tabs: PropTypes.array,
};

export default TabComponent;

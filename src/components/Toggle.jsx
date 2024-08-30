import { useState } from "react";
import "./Toggle.css"; // Import the CSS file for styling

const Toggle = ({ onToggle }) => {
  const [view, setView] = useState("chart");

  const handleToggle = () => {
    const newView = view === "chart" ? "table" : "chart";
    setView(newView);
    onToggle(newView);
  };

  return (
    <div className='toggle-container'>
      <label className='toggle-switch'>
        <input
          type='checkbox'
          checked={view === "table"}
          onChange={handleToggle}
        />
        <span className='slider'></span>
      </label>
      <span className='toggle-label'>
        {view === "chart" ? "Chart" : "Table"}
      </span>
    </div>
  );
};

export default Toggle;

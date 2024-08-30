import { useState, useEffect } from "react";
import BarChart from "./components/BarChart";
import Table from "./components/Table";
import Toggle from "./components/Toggle";
import "./App.css"; // Import the CSS file

const App = () => {
  const [view, setView] = useState("chart");
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/data.json") // Correct path for Vite
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className='chart-container'>
      <div className='header'>
        <div className='header-content'>
          <div>Data Visualization</div>
          <div>
            <Toggle onToggle={setView} />
          </div>
        </div>
      </div>
      <div className='content'>
        {view === "chart" ? <BarChart data={data} /> : <Table data={data} />}
      </div>
    </div>
  );
};

export default App;

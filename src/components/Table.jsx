import React from "react";
import "./Table.css"; // Import the CSS file

const Table = ({ data }) => {
  // Mapping of colors to foods
  const colorToFood = {
    "#66c2a5": "Avocado",
    "#fc8d62": "Carrot",
    "#8da0cb": "Blueberry",
    "#e78ac3": "Strawberry",
    // Add more mappings as needed
  };

  // Group data by color
  const groupedData = data.reduce((acc, item) => {
    if (!acc[item.color]) {
      acc[item.color] = [];
    }
    acc[item.color].push(item);
    return acc;
  }, {});

  // Sort items within each color group by value
  Object.keys(groupedData).forEach((color) => {
    groupedData[color].sort((a, b) => b.value - a.value);
  });

  return (
    <div className='table-container'>
      <table>
        <thead>
          <tr>
            <th className='color-column'>Food</th>
            <th>Name</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedData).map(([color, items], colorIndex) => (
            <React.Fragment key={colorIndex}>
              {items.map((item, itemIndex) => (
                <tr key={itemIndex}>
                  {itemIndex === 0 && (
                    <td
                      rowSpan={items.length}
                      className={`color-column ${
                        color === "yellow" ? "yellow-row" : ""
                      }`}
                      style={{ backgroundColor: item.color }}
                    >
                      {colorToFood[item.color] || "Unknown"}
                    </td>
                  )}
                  <td>{item.name}</td>
                  <td>{item.value}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

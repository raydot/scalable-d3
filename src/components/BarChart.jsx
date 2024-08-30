import { useEffect, useRef, useCallback, useState } from "react";
import * as d3 from "d3";
import "./BarChart.css"; // Import the CSS file

const BarChart = ({ data }) => {
  const svgRef = useRef();
  const [sortOrder, setSortOrder] = useState("ascending");

  const colorToFood = {
    "#66c2a5": "Avocado",
    "#fc8d62": "Carrot",
    "#8da0cb": "Blueberry",
    "#e78ac3": "Strawberry",
    // Add more mappings as needed
  };

  const drawChart = useCallback(() => {
    const svg = d3.select(svgRef.current);

    // Get the dimensions of the parent container
    const width = svg.node().parentNode.clientWidth;
    const height = svg.node().parentNode.clientHeight;

    // Calculate margins as 10% of the view width and height
    const margin = {
      top: height * 0.1,
      right: width * 0.1,
      bottom: height * 0.1,
      left: width * 0.1,
    };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Set the viewBox and preserveAspectRatio for scalability
    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    // Clear previous elements
    svg.selectAll("*").remove();

    // Define a fixed set of four colors
    const colorPalette = ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3"];

    // Calculate the frequency of each color
    const colorFrequency = data.reduce((acc, item) => {
      acc[item.color] = (acc[item.color] || 0) + 1;
      return acc;
    }, {});

    // Sort data based on the selected sort order
    let sortedData = [...data];
    if (sortOrder === "ascending") {
      sortedData.sort((a, b) => a.value - b.value);
    } else if (sortOrder === "descending") {
      sortedData.sort((a, b) => b.value - a.value);
    } else if (sortOrder === "colorFrequency") {
      sortedData.sort(
        (a, b) => colorFrequency[b.color] - colorFrequency[a.color]
      );
    }

    // Assign colors to the data items based on their original color property
    const colorMap = {};
    let colorIndex = 0;
    sortedData.forEach((d) => {
      if (!colorMap[d.color]) {
        colorMap[d.color] = colorPalette[colorIndex % colorPalette.length];
        colorIndex++;
      }
      d.color = colorMap[d.color];
    });

    // Create a group element for the bars
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3
      .scaleBand()
      .domain(sortedData.map((d, i) => i))
      .range([0, innerWidth])
      .padding(0.3); // Increased padding to prevent overlap

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(sortedData, (d) => d.value)])
      .nice()
      .range([innerHeight, 0]);

    // Create the bars
    g.selectAll("rect")
      .data(sortedData)
      .enter()
      .append("rect")
      .attr("x", (d, i) => xScale(i))
      .attr("y", (d) => yScale(d.value))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => innerHeight - yScale(d.value))
      .attr("fill", (d) => d.color)
      .on("mouseover", function (event, d) {
        d3.select(this).attr("opacity", 0.7);
        tooltip.style("visibility", "visible").html(`
            <div class="tooltip-color" style="background-color: ${d.color};"></div>
            <div>Category: ${d.name}</div>
            <div>Value: ${d.value}</div>
          `);
      })
      .on("mousemove", function (event) {
        tooltip
          .style("top", `${event.pageY - 10}px`)
          .style("left", `${event.pageX + 10}px`);
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", 1);
        tooltip.style("visibility", "hidden");
      });

    // Add axes
    g.append("g")
      .call(d3.axisLeft(yScale))
      .selectAll("text")
      .style("font-size", "clamp(12px, 2vw, 24px)"); // Apply font clamping to the left axis labels

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).tickFormat((i) => sortedData[i].name))
      .selectAll("text")
      .style("font-size", "clamp(10px, 1vw, 16px)"); // Adjusted font clamping to prevent overlap

    // Add chart title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "clamp(16px, 3vw, 32px)")
      .text("Bar Chart");

    // Add axis labels
    svg
      .append("text")
      .attr("x", -innerHeight / 2)
      .attr("y", margin.left / 4)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .style("font-size", "clamp(12px, 2vw, 24px)")
      .text("Value");

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - margin.bottom / 4)
      .attr("text-anchor", "middle")
      .style("font-size", "clamp(12px, 2vw, 24px)")
      .text("Category");

    // Add tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "white")
      .style("border", "1px solid black")
      .style("padding", "5px")
      .style("border-radius", "10px")
      .style("font-size", "clamp(10px, 1.5vw, 18px)");

    // Add legend
    const legend = svg
      .append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${margin.left}, ${margin.top / 2})`);

    const legendItems = Object.entries(colorToFood);

    legendItems.forEach(([color, food], i) => {
      const legendItem = legend
        .append("g")
        .attr("transform", `translate(${i * 100}, 0)`);

      legendItem
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", color);

      legendItem
        .append("text")
        .attr("x", 30)
        .attr("y", 15)
        .style("font-size", "clamp(12px, 1.5vw, 18px)")
        .text(food);
    });
  }, [data, sortOrder]);

  useEffect(() => {
    drawChart();
    window.addEventListener("resize", drawChart);
    return () => window.removeEventListener("resize", drawChart);
  }, [drawChart]);

  return (
    <div className='chart-container'>
      <div className='radio-buttons'>
        <label>
          <input
            type='radio'
            value='ascending'
            checked={sortOrder === "ascending"}
            onChange={() => setSortOrder("ascending")}
          />
          Ascending by Value
        </label>
        <label>
          <input
            type='radio'
            value='descending'
            checked={sortOrder === "descending"}
            onChange={() => setSortOrder("descending")}
          />
          Descending by Value
        </label>
        <label>
          <input
            type='radio'
            value='colorFrequency'
            checked={sortOrder === "colorFrequency"}
            onChange={() => setSortOrder("colorFrequency")}
          />
          Descending by Color Frequency
        </label>
      </div>
      <svg ref={svgRef} style={{ width: "100%", height: "100%" }}></svg>
    </div>
  );
};

export default BarChart;

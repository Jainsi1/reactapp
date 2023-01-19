import React from "react";
import { Chart } from "react-google-charts";

const data = [
  ["", ""],
  ["2014", 1000],
  ["2015", 1170],
  ["2016", 660],
  ["2017", 660],
  ["2018", 660],
  ["2019", 660],
];


const options = {
  legend: "none",
};



function BarChart() {
  return (
    <Chart
      chartType="Bar"
      width="100%"
      height="180px"
      data={data}
      options={options}
    />
  );
}
export default BarChart

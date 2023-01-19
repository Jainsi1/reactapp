import React from "react";
import { Chart } from "react-google-charts";

function LineChart({ data, options, chartType = 'Line' }) {

  return (
    <Chart
      chartType={chartType}
      width="100%"
      height="180px"
      data={data}
      options={options}
    />
  );
}
export default LineChart

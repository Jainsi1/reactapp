import React from 'react'
import { Chart } from 'react-google-charts';
// export const data = [
//   ["Brand NAme", "Cost", "Cos", "Quality", "ENgineering", "Services", "Sustainbility"],
//   ['SAMSUNG', 78, 90, 95, 90, 100, 100],
//   ['KIOXIA', 72, 80, 90, 95, 95, 90],
//   ['Western Digital', 74, 60, 60, 85, 90, 90],
//   ['Solidigm', 74, 60, 60, 85, 90, 90],
//   ['Micron', 74, 60, 60, 85, 90, 90],
//   ['Hynix', 74, 60, 60, 85, 90, 90]
// ];

export const options = {
  chartArea: { width: "80%" },
  colors: [
    "#3484fa",
    "#5396fa",
    "#71a8fb",
    "#8fbbfb",
    "#adcffc",
    "#cce1fd",
    "#c7d9f3",
    "#cbdbf1",
    "#ceddf4",
  ],
  isStacked: true,
  legend: {
    position: 'top',
    alignment: 'start',
    maxLines: 2,
    textStyle: {
      color: '#252525;',
      fontSize: 12,
    },
  },
};

export default function App(props) {
  let { data } = props;

  if (data == null) {
    data = [
      ["Brand NAme", "Cost", "Cos", "Quality", "ENgineering", "Services", "Sustainbility"],
      ['SAMSUNG', 78, 90, 95, 90, 100, 100],
      ['KIOXIA', 72, 80, 90, 95, 95, 90],
      ['Western Digital', 74, 60, 60, 85, 90, 90],
      ['Solidigm', 74, 60, 60, 85, 90, 90],
      ['Micron', 74, 60, 60, 85, 90, 90],
      ['Hynix', 74, 60, 60, 85, 90, 90]
    ];
  }

  return (
    <Chart
      chartType="ColumnChart"
      width="100%"
      height="400px"
      data={data}
      options={options}
    />
  );
}

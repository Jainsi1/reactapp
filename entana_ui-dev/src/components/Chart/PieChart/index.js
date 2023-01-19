import React from 'react'
import { Chart } from "react-google-charts"

function PieChart() {

  const data = [
    ["Task", "Hours per Day"],
    ["Samsung", 25],
    ["Kioxia", 25],
    ["Solidigm", 10],
    ["Hynix", 10],
    ["Micron", 20], // CSS-style declaration
  ]

  const options = {
    pieSliceText: "none",
    pieHole: 0.6,
    slices: [
      {
        color: '#3286FF',
      },
      {
        color: '#57E1FF',
      },
      {
        color: '#FDBC3F',
      },
      {
        color: '#FD833F',
      },
      {
        color: '#CC3FFD',
      },
    ],
    backgroundColor: { fill: 'transparent' },
    // legend: 'right',
    legend: {
      position: 'right',
      alignment: 'center',
      textStyle: {
        color: '#252525;',
        fontSize: 12,
      },
    },
    chartArea: {
      width: '100%',
      height: '100%',
    }
  }
  return (
    <Chart
      chartType="PieChart"
      data={data}
      options={options}
    />
  )
}

export default PieChart




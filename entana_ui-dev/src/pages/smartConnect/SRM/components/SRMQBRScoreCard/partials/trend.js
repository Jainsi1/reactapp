import GradientChart from "components/Chart/GradientChart";
import React from "react";
import Widget from "components/Widget";
import DashboardCard from "components/DashboardCard";
import { collect } from "collect.js";

const QbrTrends = (props) => {
  const { loading, error, trends, title } = props;

  const mapDataToBarChart = () => {

    const headers = collect(trends)
      .pluck('headers')
      .flatten()
      .map(e => e.toUpperCase())
      .unique()
      .prepend('Commodity')
      .toArray()

    let t = [
      headers
    ];

    const bars = [...t[ 0 ]];
    bars.shift()

    for (let item of trends) {
      let arr = [item.name];

      for (let bar of bars) {
        arr.push(item.bars?.find(e => e.name.toUpperCase() == bar)?.contribution || 0)
      }

      t.push(arr)
    }

    return t;
  }

  if (loading) return (
    <Widget className="dashboard-card-widget dashboard-card-loading">
      <h1 className="dashboard-card-text">LOADING {title}...</h1>
    </Widget>
  );

  if (error) return (
    <Widget className="dashboard-card-widget dashboard-card-loading">
      <h1 className="dashboard-card-text">Error :(</h1>
    </Widget>
  );

  return (
    <>
      <DashboardCard
        title={title}
        minHeight={true}
        extra={
          trends.length ?
            <GradientChart key="qbr-scoring" data={mapDataToBarChart()}/> :
            <h4>Not enough data</h4>
        }
      />
    </>
  )
}

export default QbrTrends;
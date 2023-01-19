import React, { useEffect, useState, useRef } from "react";
import { useQuery } from "@apollo/client";

import PageHeader from "components/PageHeader";
import Loader from "components/loaders/Loader";
import Page404 from "components/Page404";
import {
  GanttComponent,
  DayMarkers,
  Inject,
  Selection,
  Toolbar,
  Edit,
  Resize,
  ColumnsDirective,
  ColumnDirective,
  Filter,
} from "@syncfusion/ej2-react-gantt";
import "./roadmapplanning.css";

export default function RoadMapPlanning() {
  const resourceCollection = [
    { resourceId: 1, resourceName: "SAS 1WPD - PE", resourceGroup: "PE" },
    {
      resourceId: 2,
      resourceName: "SAS 1WPD - Isilon",
      resourceGroup: "Isilon",
    },
    { resourceId: 3, resourceName: "SAS 1WPD - ECS", resourceGroup: "ECS" },
    { resourceId: 4, resourceName: "PCIe 1WPD - PE", resourceGroup: "PE" },
    {
      resourceId: 5,
      resourceName: "PCIe 1WPD - Isilon",
      resourceGroup: "Isilon",
    },
    { resourceId: 6, resourceName: "PCIe 1WPD - ECS", resourceGroup: "ECS" },
  ];

  const projectData = [
    {
      TaskID: 1,
      TaskName: "Samsung",
      subtasks: [
        {
          TaskID: 10001,
          TaskName: "Samsung PM1643 (1920/3840/7680/15360GB)",
          StartDate: new Date("03/29/2019"),
          Duration: 210,
          resources: [{ resourceId: 1 }],
        },
        {
          TaskID: 10002,
          TaskName: "Samsung PM1643a (1920/3840/7680/15360GB)",
          StartDate: new Date("10/29/2019"),
          Duration: 210,
          resources: [{ resourceId: 1 }],
        },
        {
          TaskID: 10003,
          TaskName: "Samsung PM1653 (1920/3840/7680/15360GB)",
          StartDate: new Date("05/29/2020"),
          Duration: 210,
          resources: [{ resourceId: 1 }],
        },
        {
          TaskID: 10004,
          TaskName: "Samsung PM1653a (1920/3840/7680/15360GB)",
          StartDate: new Date("12/30/2020"),
          Duration: 210,
          resources: [{ resourceId: 1 }],
        },
      ],
    },
    {
      TaskID: 2,
      TaskName: "Kioxia",

      subtasks: [
        {
          TaskID: 20001,
          TaskName: "Kioxia PM4 (1920/3840/7680)",
          StartDate: new Date("05/29/2019"),
          Duration: 210,
          resources: [{ resourceId: 1 }],
        },
        {
          TaskID: 20002,
          TaskName: "Kioxia PM5 (1920/3840/7680)",
          StartDate: new Date("12/29/2019"),
          Duration: 210,
          resources: [{ resourceId: 1 }],
        },
        {
          TaskID: 20003,
          TaskName: "Kioxia PM6 (1920/3840/7680/15360GB)",
          StartDate: new Date("08/29/2020"),
          Duration: 210,
          resources: [{ resourceId: 1 }],
        },
        {
          TaskID: 20004,
          TaskName: "Kioxia PM7 (1920/3840/7680/15360GB)",
          StartDate: new Date("09/30/2021"),
          Duration: 210,
          resources: [{ resourceId: 1 }],
        },
      ],
    },
  ];

  const resourceFields = {
    id: "resourceId",
    name: "resourceName",
    unit: "Unit",
    group: "resourceGroup",
  };

  const splitterSettings = {
    columnIndex: 2,
    position: "0%",
  };

  const taskValues = {
    id: "TaskID",
    name: "TaskName",
    startDate: "StartDate",
    endDate: "EndDate",
    duration: "Duration",
    progress: "Progress",
    dependency: "Predecessor",
    resourceInfo: "resources",
    work: "work",
    expandState: "isExpand",
    child: "subtasks",
    indicators: "Indicators",
  };

  const timeline = {
    timelineUnitSize: 150,
    topTier: {
      unit: "Year",
    },
    bottomTier: {
      unit: "Month",
      count: 3,
      formatter: (date) => {
        var month = date.getMonth();
        if (month >= 0 && month <= 2) {
          return "Q1";
        } else if (month >= 3 && month <= 5) {
          return "Q2";
        } else if (month >= 6 && month <= 8) {
          return "Q3";
        } else {
          return "Q4";
        }
      },
    },
  };

  const labelSettings = {
    taskLabel: "TaskName",
  };

  var es1Date = "2019/03/23";
  const templateTaskbar = taskbarTooltip;
  function taskbarTooltip(props) {
    return (
      <table>
        <tr>
          <td style={{ padding: "3px" }}>
            <b>{props.ganttProperties.resourceNames}</b>
          </td>
        </tr>
        <tr>
          <td style={{ padding: "3px" }}>ES1 Date: {es1Date}</td>
        </tr>
        <tr>
          <td style={{ padding: "3px" }}>ES2 Date: {es1Date}</td>
        </tr>
        <tr>
          <td style={{ padding: "3px" }}>QS Date: {es1Date}</td>
        </tr>
        <tr>
          <td style={{ padding: "3px" }}>Qual Start Date: {es1Date}</td>
        </tr>
        <tr>
          <td style={{ padding: "3px" }}>Qual Complete Date: {es1Date}</td>
        </tr>
        <tr>
          <td style={{ padding: "3px" }}>RTM Date: {es1Date}</td>
        </tr>
        <tr>
          <td style={{ padding: "3px" }}>RTS Date: {es1Date}</td>
        </tr>
        <tr>
          <td style={{ padding: "3px" }}>LTB Date: {es1Date}</td>
        </tr>
        <tr>
          <td style={{ padding: "3px" }}>LTS Date: {es1Date}</td>
        </tr>
      </table>
    );
  }
  const templateBaseline = baselineTooltip;
  function baselineTooltip(props) {
    return (
      <table>
        <tbody>
          <tr>
            <td>Nothing</td>
          </tr>
        </tbody>
      </table>
    );
  }

  const tooltipSettings = {
    showTooltip: true,
    taskbar: templateTaskbar.bind(this),
    baseline: templateBaseline.bind(this),
  };

  const editSettings = {
    allowAdding: true,
    allowEditing: true,
    allowDeleting: true,
    allowTaskbarEditing: true,
    showDeleteConfirmDialog: true,
  };
  const toolbar = [
    "Add",
    "Edit",
    "Update",
    "Delete",
    "Cancel",
    "ExpandAll",
    "CollapseAll",
    "Search",
  ];

  return (
    <>
      <PageHeader title="Transition Planner" />
      <GanttComponent
        taskbarHeight={50}
        rowHeight={50}
        treeColumnIndex={1}
        splitterSettings={splitterSettings}
        collapseAllParentTasks={false}
        showOverAllocation={false}
        enableMultiTaskbar={true}
        editSettings={editSettings}
        toolbar={toolbar}
        allowSelection={true}
        allowResizing={true}
        labelSettings={labelSettings}
        dataSource={projectData}
        timelineSettings={timeline}
        viewType="ResourceView"
        resourceFields={resourceFields}
        taskFields={taskValues}
        resources={resourceCollection}
        height="610px"
        tooltipSettings={tooltipSettings}
        ref={(gantt) => gantt}
      >
        <ColumnsDirective>
          <ColumnDirective
            field="TaskName"
            headerText="Product"
            visible={"false"}
          >
            {" "}
          </ColumnDirective>
        </ColumnsDirective>
        <Inject
          services={[Selection, DayMarkers, Filter, Toolbar, Edit, Resize]}
        />
      </GanttComponent>
    </>
  );
}

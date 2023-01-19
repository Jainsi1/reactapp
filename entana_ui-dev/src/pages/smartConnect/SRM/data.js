import {
  tableTitle,
  tableDataText,
  tableLeadText,
  costTableText,
  costTableTextRed,
  costTableTextGreen,
} from "utils/table";
import businessTable from "../../components/TableTag/businessTable";
import "./srm.css";
import BusinessActionsTable from "components/ActionsTable/BusinessActionsTable";
import ExpandedTable from "components/SRMTable/expandedTable";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
// import { Table } from 'antd';
import { onDeleteRecord } from "../../components/TableCard/index";

export const data = [
  {
    heading: "SAMSUNG",
    mainNumber: "4",
    mainInfoNumber: "2",
    subInfoNumber: "2",
    calNumber: "2/1",
    subCalNumber: "3/15",
  },
  {
    heading: "INTEL",
    mainNumber: "2",
    mainInfoNumber: "3",
    subInfoNumber: "6",
    calNumber: "3/6",
    subCalNumber: "3/21",
  },
  {
    heading: "KIOXIA",
    mainNumber: "2",
    mainInfoNumber: "nil",
    subInfoNumber: "4",
    calNumber: "4/1",
    subCalNumber: "3/16",
  },
  {
    heading: "MICRON",
    mainNumber: "1",
    mainInfoNumber: "NIL",
    subInfoNumber: "NIL",
    calNumber: "2/15",
    subCalNumber: "3/17",
  },
  {
    heading: "SOLIDIGM",
    mainNumber: "1",
    mainInfoNumber: "NIL",
    subInfoNumber: "NIL",
    calNumber: "2/15",
    subCalNumber: "3/17",
  },
  {
    heading: "HDHTGDC",
    mainNumber: "1",
    mainInfoNumber: "NIL",
    subInfoNumber: "NIL",
    calNumber: "2/15",
    subCalNumber: "3/17",
  },
  {
    heading: "RUNBD",
    mainNumber: "1",
    mainInfoNumber: "NIL",
    subInfoNumber: "NIL",
    calNumber: "2/15",
    subCalNumber: "3/17",
  },
  {
    heading: "QXFTDV",
    mainNumber: "1",
    mainInfoNumber: "NIL",
    subInfoNumber: "NIL",
    calNumber: "2/15",
    subCalNumber: "3/17",
  },
  {
    heading: "KHNJYG",
    mainNumber: "1",
    mainInfoNumber: "NIL",
    subInfoNumber: "NIL",
    calNumber: "2/15",
    subCalNumber: "3/17",
  },
];

// export const BusinessColumns = [
//   {
//     title: "#",
//     dataIndex: "no",
//     render: (text, record, index) => `${index + 1}`,
//   },
//   {
//     title: "TITLE",
//     dataIndex: "title",
//     render: tableTitle,
//   },
//   {
//     title: "BUSINESS OBJECTIVE",
//     dataIndex: "businessObjective",
//     className: "tableDataText",
//   },
//   {
//     title: "EXPECTED BENIFITS",
//     dataIndex: "expectedBenefits",
//     className: "tableDataText",
//   },
//   {
//     title: "LEAD",
//     dataIndex: "lead",
//     render: tableLeadText,
//   },
//   {
//     title: "LOB",
//     dataIndex: "lob",
//     className: "tableDataText",
//   },
//   {
//     title: "PLAN",
//     dataIndex: "plan",
//     className: "tableDataText",
//   },
//   {
//     title: "CURRENT",
//     dataIndex: "current",
//     render: businessTable,
//   },
//   {
//     title: "ACTIONS",
//     dataIndex: "actions",
//     // render: (text, record) => <ActionsTable text={text} record={record} />
//     render: (record) => {
//       return (
//         <>
//           <EditOutlined />
//           <DeleteOutlined style={{ color: "red", marginLeft: 12 }} />
//         </>
//       );
//     },
//   },
// ];

export const ExpandedBusinessColumns = [
  {
    title: "#",
    dataIndex: "no",
    className: "tableDataText",
  },
  {
    title: "ACTION",
    dataIndex: "action",
    render: tableTitle,
  },
  {
    title: "OWNER",
    dataIndex: "ownerName",
    className: "tableDataText",
  },
  {
    title: "COMMENTS",
    dataIndex: "comments",
    className: "tableDataText",
  },
  {
    title: "STATUS",
    dataIndex: "status",
    className: "tableDataText",
  },
  {
    title: "ETC",
    dataIndex: "etc",
    className: "tableDataText",
  },
  {
    title: "ACTIONS",
    dataIndex: "actions",
    render: (text, record) => (
      <BusinessActionsTable text={text} record={record} />
    ),
  },
];

export const ChangeBusinessActionsData = [
  {
    no: "1",
    action: "Provide budgetary cost forecast for z-nand",
    comments: `Cost targetted at $1.50/GB CS available in Jun'22`,
    ownerName: "Tom M",
    status: "Open",
    etc: `15 Jan'22`,
  },

  {
    no: "2",
    action: "Review business case with PDM engineering for prioritization",
    comments: "To be reviewed in upcoming POR meeting",
    ownerName: "Sunny A",
    status: "Open",
    etc: `30 Jan'22`,
  },

  {
    no: "3",
    action: "Align with marketing for first to market proposal",
    comments: "Meeting scheduled with Bryan B for WK 13 Jan",
    ownerName: "Sunny A",
    status: "Open",
    etc: `30 Jun'22`,
  },
];

// export const RunBusinessData = [
//   {
//     no: '1',
//     title: 'PCIe Gen4 Transition',
//     businessObjective: 'Enable access to next gen technology',
//     expectedBenifits: 'Improve employer mindshare',
//     lead: 'Sunny A',
//     lob: `ISG-SSD`,
//     plan: `FQ3'22`,
//     current: `FQ3'22`,
//   },
//   {
//     no: '2',
//     title: 'PCIe Gen4 Transition',
//     businessObjective: 'Enable lower cost structure TLC technology vs MLC',
//     expectedBenifits: 'Reduce Cost',
//     lead: 'Sunny A',
//     lob: `ISG-SSD`,
//     plan: `FQ2'22`,
//     current: `FQ2'22`,
//   },
//   {
//     no: '3',
//     title: 'PCIe Gen4 Transition',
//     businessObjective: ' Enable 24G support for next gen server',
//     expectedBenifits: 'Technology Leadership',
//     lead: 'Sunny A',
//     lob: `ISG-SSD`,
//     plan: `FQ1'22`,
//     current: `FQ1'22`,
//   },
// ];

// export const ChangeBusinessData = [
//   {
//     no: 1,
//     title: 'Z-Nand',
//     businessObjective: 'Colleborate on new nand technology',
//     expectedBenifits: 'First to market advantage',
//     lead: 'Sunny A',
//     lob: `ISG-SSD`,
//     plan: `FQ3'22`,
//     current: `FQ4'22`,
//     changeBusiness: true,
//     expand: true,
//     tasks: <ExpandedTable columns={ExpandedBusinessColumns} data={ChangeBusinessActionsData} />
//   },
// ]


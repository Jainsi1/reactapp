import { DatePicker, Typography } from 'antd';
import { CheckSquareFilled, CloseSquareFilled } from '@ant-design/icons';
import moment from 'moment';
import { getUserRole } from 'utils/user';
import { Input } from 'antd';
import { useState } from 'react';


const isSupplier = getUserRole() === 'supplier';

const { TextArea } = Input;
const { Text } = Typography

const sharedOnCell = (_, index) => {
  // if (index === 0) {
  //   return {
  //     colSpan: 0,
  //   };
  // }
  return {};
};

export default function formatColumns(dateColumns) {

  const extraColumns = []
  for (let date of dateColumns) {
    extraColumns.push({
      title: date,
      dataIndex: date,
      render: (text, record) => {
        let value = 0;

        for (let d of dateColumns) {
          value += parseInt(record[ d ]) || 0;
          if (d == date) {
            break
          }
        }

        if (value === 0) {
          return "0%"
        }

        let percentage = (value / record.total) * 100

        console.log({ date, value, f: Math.round(percentage) })

        return Math.round(percentage) + "%";
      }
    })
  }

  return [
    {
      title: "Name",
      dataIndex: "supplierName",
      fixed: true,
      onCell: (_, index) => {
        if (index % 2 == 0) {
          return {
            rowSpan: 2,
          };
        }
        // These two are merged into above cell
        if (index % 2 == 1) {
          return {
            rowSpan: 0,
          };
        }
      },
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    ...extraColumns,
    {
      title: "Summary",
      dataIndex: "summary",
      onCell: (_, index) => {
        if (index % 2 == 0) {
          return {
            rowSpan: 2,
          };
        }
        // These two are merged into above cell
        if (index % 2 == 1) {
          return {
            rowSpan: 0,
          };
        }
      },
      render: (text, { total, pending, accepted, rejected }) => {

        return (
          <>
            <ul>
              <li style={{ height: 20 }}>Accepted {accepted} of {total}</li>
              <li style={{ height: 20 }}>Rejected {rejected} of {total}</li>
              <li style={{ height: 20 }}>NO Response on {pending} of {total}</li>
            </ul>

            <a> Send Report TO SUPPLIER</a>
          </>
        );
      }
    },
  ]
}
import React, { useEffect, useState } from 'react';
import TableCard from 'components/TableCard';
import formatColumns from './SupplyColumns';
import { useUpdateOrder } from './graphql/mutation';
import WithRequestData from 'components/RequestWrapper';
import OrderDetailsModal from 'components/OrderDetailsModal';
import { GET_AUDIT_TRAIL } from './graphql/query';
import { Pagination, Table } from 'antd';
import { useRef } from 'react';

const PAGE_SIZE = 20;

function getFormattedOrders(orders, current, filter, PAGE_SIZE = 20) {

  return orders?.filter(order => filter == 'all' ? true : order.accepted === filter)
    .slice(0, current * PAGE_SIZE)
    .map((order, idx) => {
      return {
        no: idx + 1,
        id: parseInt(order.id),
        key: order.id,
        name: order.supplier.name,
        ...order
      }
    });
};

export const TableContext = React.createContext();

const dataSource = [
  {
    name: "Cybax Equipment Manufacturing",
    status: "Accepted",
    "10-01": "10%",
    "11-01": "20%",
    "12-01": "30%",
    "13-01": "40%",
  },
  {
    name: "Cybax Equipment Manufacturing",
    status: "Rejected",
    "10-01": "10%",
    "11-01": "20%",
    "12-01": "30%",
    "13-01": "40%",
  },
  {
    name: "Sysbase Manufacturing",
    status: "Accepted",
    "10-01": "15%",
    "11-01": "24%",
    "12-01": "37%",
    "13-01": "48%",
  },
  {
    name: "Sysbase Manufacturing",
    status: "Rejected",
    "10-01": "13%",
    "11-01": "34%",
    "12-01": "40%",
    "13-01": "70%",
  }
]

const SupplyInfoOrders = (props) => {
  const { orders, dateColumns } = props;
  console.log({ orders, dateColumns })
  const [tblLoading, setTblLoading] = useState(false);

  const orderColumns = formatColumns(dateColumns)

  return (
    <TableContext.Provider value={props}>

      <Table
        dataSource={orders}
        loading={tblLoading}
        columns={orderColumns}
        size="small"
        pagination={false}
      />

    </TableContext.Provider>
  )
};

export default SupplyInfoOrders;
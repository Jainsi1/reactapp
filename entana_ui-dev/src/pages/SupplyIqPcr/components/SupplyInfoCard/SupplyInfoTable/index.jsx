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

const SupplyInfoOrders = (props) => {
  const {
    orders,
    setColumns,
    displayColumns,
    acceptedFilter,
    refetch,
    updateOrderNow,
    reloadTable
  } = props;

  const updateOrderWithLoading = useUpdateOrder()
  const [displayOrderInfo, setDisplayOrderInfo] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(undefined);
  const [current, setCurrent] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [tblLoading, setTblLoading] = useState(false);

  const updateOrder = async (data) => {
    setTblLoading(() => true)
    await updateOrderWithLoading(data)
    setTblLoading(() => false)
  }


  const orderColumns = formatColumns(
    {
      updateOrder,
      ...props,
      setDisplayOrderInfo,
      setSelectedOrder,
      columns: orders.length != 0 ? Object.keys(orders[ 0 ]) : [],
      refetch,
      updateOrderNow
    })

  useEffect(() => {
    setColumns(orderColumns.map(({ title, must }) => { return { title, must } }));
  }, []);

  const onScroll = function () {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
      setIsLoading(true)
      setTimeout(() => setCurrent(current + 1), 200)
      setTimeout(() => setIsLoading(false), 2000)
    }
  }


  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [isLoading])

  return (
    <TableContext.Provider value={props}>

      <Table
        dataSource={getFormattedOrders(orders, current, acceptedFilter, PAGE_SIZE)}
        loading={tblLoading}
        columns={displayColumns.length ? orderColumns.filter((e, idx) => displayColumns.includes(idx)) : orderColumns.filter(e => e.must)}
        size="small"
        scroll={{
          x: 2000,
          y: 500,
        }}
        pagination={false}
      />
      {displayOrderInfo &&
        <WithRequestData
          query={GET_AUDIT_TRAIL}
          variables={{ id: selectedOrder.id }}
          fetchPolicy="network-only"
        >
          {
            ({ data }) => (
              <OrderDetailsModal
                order={selectedOrder}
                auditTrail={data.getAuditTrail}
                onModalClose={() => {
                  setDisplayOrderInfo(false);
                  setSelectedOrder(false);
                }}
              />
            )
          }
        </WithRequestData>
      }
      {
        1 + current * PAGE_SIZE < orders.length && isLoading && <p className='tw-text-center mt-3'>Loading...</p>
      }
    </TableContext.Provider>
  )
};

export default SupplyInfoOrders;
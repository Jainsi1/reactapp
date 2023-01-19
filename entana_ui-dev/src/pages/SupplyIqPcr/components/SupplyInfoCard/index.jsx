import React, { useEffect, useState } from 'react';
import { Collapse } from 'antd';
import SupplyInfoOrders from 'pages/SupplyIqPcr/components/SupplyInfoCard/SupplyInfoTable';
import SupplyHeader from './SupplyIQHeader';
import { useLazyQuery } from '@apollo/client';
import { GET_SUPPLY_INFO } from 'pages/SupplyIqPcr/graphql/query';
import Loader from 'components/loaders/Loader';
import { sleep } from 'utils/func';

const { Panel } = Collapse;


export default function SupplyInfoCard(props) {

  const { supplyInfoByCommodity } = props

  const supplyInfoCardStyle = "mb-10 bg-white p-5"


  if ( !!!supplyInfoByCommodity) {
    return (
      <EmptySupplyInfo {...props} className={supplyInfoCardStyle}/>
    )
  }

  return (
    <SupplyInfoByCommodity {...props} className={supplyInfoCardStyle}/>
  )
}

const EmptySupplyInfo = (props) => {
  const { commodity, className } = props;

  return (
    <div className={className}>
      <h1>PO/PR/Forecast Change Requests for commodity: <strong className={'text-lg'}>{commodity.name}</strong></h1>
      <h1>No records found</h1>
    </div>
  )
}

const useSupplyinfo = (latestSupplierInfo, supplyInfoId) => {
  const [supplyInfo, setSupplyInfo] = useState(latestSupplierInfo);

  const [getSupplyInfo, { loading, error, data, refetch }] = useLazyQuery(GET_SUPPLY_INFO, {
    variables: {
      data: {
        commodityInput: {
          id: parseInt(supplyInfoId),
          page: 1,
        }
      }
    },
    fetchPolicy: 'network-only'
  })

  const updateOrderNow = (order) => {
    setSupplyInfo(data => {
      const index = data.orders.findIndex(e => e.id == order.id)
      if (index > -1) {
        data.orders[ index ] = order
      }

      return data
    })
  }

  useEffect(() => {
    if (latestSupplierInfo.id !== supplyInfoId) {

      getSupplyInfo()
    }
  }, [supplyInfoId])

  useEffect(() => {
    if (data) {
      setSupplyInfo(data.getSupplyInfo.data[ 0 ])
    }
  }, [loading])

  return [
    supplyInfo, {
      loading, error, refetch, updateOrderNow
    }
  ]
}

const SupplyInfoByCommodity = (props) => {

  const { supplyInfoByCommodity, commodity, className, times: history } = props;
  const [currentSupplyInfoId, setCurrentSupplyInfoId] = useState(supplyInfoByCommodity?.id)
  // TODO : NEED TO REFACTOR COLUMN MANIPULATION LOGIC
  const [columns, setColumns] = useState([]);
  const [displayColumns, setDisplayColumns] = useState([])
  const [panelOpen, setPanelOpen] = useState([]);
  const [acceptedFilter, setAcceptedFilter] = useState('all')

  const [supplyInfo, {
    loading,
    error,
    refetch,
    updateOrderNow,
  }] = useSupplyinfo(supplyInfoByCommodity, currentSupplyInfoId)

  const maxSupplyInfoId = Math.max(...history.map(supplyInfo => parseInt(supplyInfo.id)))

  if (loading) {
    return (<Loader/>);
  }
  if (error) {
    return (<p>Some problem on the server right now!</p>);
  }


  return (
    <div className={className}>
      <div className={'flex justify-between mb-3'}>
        <h1>PO/PR/Forecast Change Requests for commodity: <strong className={'text-lg'}>{commodity.name}</strong></h1>
        <SupplyHeader
          history={history}
          columns={columns}
          setPanelOpen={setPanelOpen}
          setDisplayColumns={setDisplayColumns}
          setCurrentSupplyInfoId={setCurrentSupplyInfoId}
          currentSupplyInfoId={currentSupplyInfoId}
          supplyInfo={supplyInfo}
          acceptedFilter={acceptedFilter}
          setAcceptedFilter={setAcceptedFilter}
        />
      </div>
      {
        loading ? <div>Loading Large File from Server...</div> : null
      }
      {
        supplyInfo && <Collapse accordion onChange={(e) => setPanelOpen(e)} activeKey={panelOpen} key={supplyInfo.id}>
          <Panel header={supplyInfo.date} key={supplyInfo.id}>
            <SupplyInfoOrders
              commodityId={commodity.id}
              isEditable={maxSupplyInfoId == supplyInfo.id}
              setColumns={setColumns}
              orders={supplyInfo.orders}
              displayColumns={displayColumns}
              key={supplyInfo.id}
              acceptedFilter={acceptedFilter}
              refetch={refetch}
              updateOrderNow={updateOrderNow}
            />
          </Panel>
        </Collapse>
      }
    </div>
  );
};





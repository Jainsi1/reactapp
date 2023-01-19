import React, { useEffect, useState } from 'react';
import { Collapse } from 'antd';
import SupplyInfoOrders from 'pages/supplyPcrReport/components/SupplyInfoCard/SupplyInfoTable';
import SupplyHeader from './SupplyIQHeader';
import { useLazyQuery } from '@apollo/client';
import { GET_SUPPLY_PCR_REPORT } from 'pages/supplyPcrReport/graphql/query';
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
      <h1>Commodity: <strong className={'text-lg'}>{commodity.name}</strong></h1>
      <h1>No records found</h1>
    </div>
  )
}

const useSupplyinfo = (latestSupplierInfo, supplyInfoId, commodityId) => {
  const [supplyInfo, setSupplyInfo] = useState(latestSupplierInfo);
  const [getSupplyPcrReport, { loading, error, data, refetch }] = useLazyQuery(GET_SUPPLY_PCR_REPORT, {
    variables: {
      data: {
        commodityInput: {
          commodityId,
          id: parseInt(supplyInfoId),
        }
      }
    },
    fetchPolicy: 'network-only'
  })

  useEffect(() => {
    if (latestSupplierInfo.id !== supplyInfoId) {
      getSupplyPcrReport()
    }
  }, [supplyInfoId])

  useEffect(() => {
    if (data) {
      setSupplyInfo(JSON.parse(data.getSupplyPcrReport.data)[ commodityId ])
    }
  }, [loading])

  return [supplyInfo, { loading, error, refetch }]
}

const SupplyInfoByCommodity = (props) => {

  console.log({ props })

  const { supplyInfoByCommodity, commodity, className } = props;
  const [currentSupplyInfoId, setCurrentSupplyInfoId] = useState(supplyInfoByCommodity?.id)
  const [panelOpen, setPanelOpen] = useState([]);

  const [supplyInfo, {
    loading,
    error,
    refetch,
  }] = useSupplyinfo(supplyInfoByCommodity, currentSupplyInfoId, commodity.id)

  if (loading) {
    return (<Loader/>);
  }
  if (error) {
    return (<p>Some problem on the server right now!</p>);
  }

  return (
    <div className={className} id={"supplyPcr" + supplyInfo.id}>
      <div className={'flex justify-between mb-3'}>
        <h1>Commodity: <strong className={'text-lg'}>{commodity.name}</strong></h1>
        <SupplyHeader
          setCurrentSupplyInfoId={setCurrentSupplyInfoId}
          currentSupplyInfoId={currentSupplyInfoId}
          setPanelOpen={setPanelOpen}
          supplyInfo={supplyInfo}
        />
      </div>
      {
        loading ? <div>Loading Large File from Server...</div> : null
      }
      {
        supplyInfo && <Collapse accordion onChange={(e) => setPanelOpen(e)} activeKey={panelOpen} key={supplyInfo.id}>
          <Panel header={supplyInfo.date} key={commodity.id}>
            <SupplyInfoOrders
              commodityId={commodity.id}
              orders={supplyInfo.report}
              dateColumns={supplyInfo.dateColumns}
              refetch={refetch}
              key={commodity.id}
            />
          </Panel>
        </Collapse>
      }
    </div>
  );
};





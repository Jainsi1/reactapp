import React, { useEffect, useState } from 'react';
import PageHeader from 'components/PageHeader';
import SupplyInfoCard from 'pages/supplyPcrReport/components/SupplyInfoCard';
import { Button, message } from 'antd';
import { GET_SUPPLY_PCR_REPORT } from './graphql/query';
import WithRequestData from 'components/RequestWrapper';
import { getUserRole } from 'utils/user';
import ExcelUploadDrawer from './components/SupplyInfoUploadDrawer';
import * as XLSX from "xlsx";

const isSupplier = getUserRole() === 'supplier';

export const SupplyOrderContext = React.createContext();

export default function SupplyPcrReport() {
  const [allCommodity, setAllCommodity] = useState([]);
  const [selectedCommodity, setSelectedCommodity] = useState([]);
  const [openDrawer, toggleDrawer] = useState(false);
  const [data, setData] = useState([]);


  return (
    // <div key={uniqueFetch}>
    <>
      <PageHeader
        title="Reporting - Supply PCR"
        setSelectedCommodities={setSelectedCommodity}
        setAllCommodities={setAllCommodity}
      >
      </PageHeader>
      <br/>
      {selectedCommodity?.length && (
        <WithRequestData
          query={GET_SUPPLY_PCR_REPORT}
          variables={{
            data: {
              commodityInput: selectedCommodity.map(({ id }) => {
                return { commodityId: id }
              })
            }
          }}
        >
          {
            ({ data, refetch }) => (
              <>
                <SupplyIqPcrList
                  selectedCommodity={selectedCommodity}
                  data={JSON.parse(data?.getSupplyPcrReport.data) || {}}
                  refetch={refetch}
                />
              </>

            )
          }
        </WithRequestData>
      )}
    </>
    // </div>
  );
}


const SupplyIqPcrList = (props) => {
  const { selectedCommodity, refetch, data, times } = props
  return (
    <>
      {
        selectedCommodity.map((commodity) =>
          <SupplyInfoCard
            supplyInfoByCommodity={data[ commodity.id ]}
            commodity={commodity}
            key={commodity.id}
          />
        )
      }
    </>
  );
}
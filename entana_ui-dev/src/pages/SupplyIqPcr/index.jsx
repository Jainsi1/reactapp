import React, { useEffect, useState } from 'react';
import PageHeader from 'components/PageHeader';
import SupplyInfoCard from 'pages/SupplyIqPcr/components/SupplyInfoCard';
import { Button, message } from 'antd';
import { GET_SUPPLY_INFO } from './graphql/query';
import WithRequestData from 'components/RequestWrapper';
import { getUserRole } from 'utils/user';
import ExcelUploadDrawer from './components/SupplyInfoUploadDrawer';
import * as XLSX from "xlsx";

const isSupplier = getUserRole() === 'supplier';

export const SupplyOrderContext = React.createContext();

export default function SupplyIQPage() {
  const [allCommodity, setAllCommodity] = useState([]);
  const [selectedCommodity, setSelectedCommodity] = useState([]);
  const [openDrawer, toggleDrawer] = useState(false);
  const [data, setData] = useState([]);

  // const [uniqueFetch, refetch] = useForceRender();

  function exportExcel() {
    if (data.length === 0) {
      message.error("No data to export");
      return;
    }
    message.loading("Exporting data to excel...", 3);


    const orders = selectedCommodity
      .map((commodity) => data.find((supply) => supply.commodityId == commodity.id))
      .filter((supply) => supply)
      .map((supply) => supply.orders)
      .flat()
      .map(({ __typename, ...order }) => {
        let action = "Schedule-in"

        if ( !order.rescheduleDate || !order.rescheduleDate) {
          action = "Cancel"
        }

        if (order.rescheduleDate > order.requestedDate) {
          action = "Schedule-out"
        }

        return {
          "Vendor": order.vendorId,
          "Name": order.supplier.name,
          "Material No": order.materialNumber,
          "Revision": order.revision,
          "Description": order.description,
          "Vnd Mat No": order.vendorMaterialNumber,
          "QC PO": order.qcPo,
          "Doc. Type": order.docType,
          "Schedule line key": order.scheduleLineKey,
          "PO Issuance Date": order.poIssuanceDate,
          "Doc. No": order.docNumber,
          "PO Qty": order.poQty,
          "Open Qty": order.openQty,
          "UOM": order.uom,
          "Currency": order.currency,
          "Net Price": order.netPrice,
          "Price/Unit": order.pricePerUnit,
          "Pymnt Term": order.paymentTerm,
          "Requested Date": order.requestedDate,
          "Reschedule ETA": order.rescheduleDate,
          "Supplier Confirm Date": order.supplierDate,
          "Supplier Remarks": order.supplierRemarks,
          "Action": action,
          "Industry Code": order.industryCode,
          "MRP Controller": order.mrpController,
          "Purc Grp": order.purcGroup,
          "Vendor Ld Time": order.vendorLdTime,
          "Tax Code": order.taxCode,
        }
      }); // drop __typename from orders to prevent error

    const worksheet = XLSX.utils.json_to_sheet(orders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SupplyIQ");
    XLSX.writeFile(workbook, "DataSheet.xlsx");
  }


  return (
    // <div key={uniqueFetch}>
    <>
      <PageHeader
        title="SupplyIQ - PCR"
        setSelectedCommodities={setSelectedCommodity}
        setAllCommodities={setAllCommodity}
      >
        <div className={'flex gap-3 mr-3'}>
          {isSupplier || <Button onClick={exportExcel}>Export to excel</Button>}
          {isSupplier || <Button type="primary" onClick={() => toggleDrawer(true)}> Upload Excel </Button>}
        </div>
      </ PageHeader>
      <br/>
      <WithRequestData
        query={GET_SUPPLY_INFO}
        variables={{
          data: {
            commodityInput: selectedCommodity.map((commodity) => {
              return {
                commodityId: parseInt(commodity.id),
                page: 1,
              }
            }),
            getHistory: true,
          }
        }}
      >
        {
          ({ data, refetch }) => (
            <>
              {setData(data?.getSupplyInfo.data)}
              <SupplyIqPcrList
                selectedCommodity={selectedCommodity}
                data={data?.getSupplyInfo.data}
                refetch={refetch}
                times={data?.getSupplyInfo.dateList}/>
              < ExcelUploadDrawer
                open={openDrawer}
                toggle={toggleDrawer}
                commodities={allCommodity}
                refetch={refetch}
              />
            </>

          )
        }
      </WithRequestData>
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
            // supplyInfoByCommodity={data.filter(supply => supply.commodityId == commodity.id)}
            supplyInfoByCommodity={data.find(supply => supply.commodityId == commodity.id)}
            times={times.filter(time => time.commodityId == commodity.id).reverse()}
            commodity={commodity}
            key={commodity.id}
          />
        )
      }
    </>
  );
}
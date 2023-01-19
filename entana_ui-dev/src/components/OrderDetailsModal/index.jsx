import React, { Fragment } from 'react';
import { Modal, Typography } from 'antd';
import moment from "moment";

const { Text } = Typography

const columnToDisplayNameMap = {
  name: "Name",
  vendorId: "Vendor",
  materialNumber: "Material Number",
  revision: "Revision",
  description: "Description",
  vendorMaterialNumber: "Vendor Material Number",
  qcPo: "QC PO",
  docType: "Doc Type",
  scheduleLineKey: "Schedule Key Line",
  poIssuanceDate: "PO Issuance Date",
  docNumber: "Doc Number",
  poQty: "PO Qty",
  openQty: "Open Qty",
  uom: "UOM",
  currency: "Currency",
  netPrice: "Net Price",
  pricePerUnit: "Price per Unit",
  paymentTerm: "Payment term",
  requestedDate: "Requested Date",
  rescheduleDate: "Reschedule Date",
  buyerRemarks: "Buyer Remarks",
  supplierDate: "New Date",
  supplierRemarks: "Supplier Remarks",
  industryCode: "Industry Code",
  mrpController: "MRP Controller",
  purcGroup: "Purc Group",
  vendorLdTime: "Vendor LD Time",
  taxCode: "Tax Code",
  accepted: "Accepted Flag"
};

const OrderDetailsModal = ({ auditTrail, order, onModalClose }) => {
  const renderOrderDetails = () => {
    const details = [];
    for (const key in order) {
      if (key !== 'createdAt' &&
        key !== 'updatedAt' &&
        key !== 'deletedAt' &&
        key != 'id' &&
        key !== 'supplierId' &&
        key !== 'supplyInfoId' &&
        key !== 'supplier' &&
        key !== '__typename' &&
        key !== 'isActive') {
        details.push(<div style={{ display: "flex" }}>
          <div style={{ fontWeight: "500", width: "200px" }}>{columnToDisplayNameMap[ key ]}</div>
          <div>{key === 'supplierRemarks' ?
            <Text
              style={{ maxWidth: 300 }}
              ellipsis={{ tooltip: order[ key ] }}
            >{order[ key ]}
            </Text> : order[ key ]
          }</div>
        </div>)
      }
    }
    return details;
  };

  return (
    <Modal width={600} footer={null} title={'View all Data'} visible={true} onCancel={onModalClose}>
      <div style={{ overflow: "auto", height: "400px" }}>
        {renderOrderDetails()}
        <hr/>
        <h3>Audit trail</h3>
        {auditTrail.map(item => {
          const name = item.user.firstName + " " + item.user.lastName;
          let content = <>{name} created the item</>;
          if (item.action !== 'CREATE') {
            content = <>{name} updated {columnToDisplayNameMap[ item.field ]} from <b>{
              item.field === 'supplierRemarks' ?
                <Text
                  style={{ maxWidth: 100 }}
                  ellipsis={{ tooltip: item.oldValue }}
                >{item.oldValue}
                </Text> : item.oldValue
            }</b> to <b>{
              item.field === 'supplierRemarks' ?
                <Text
                  style={{ maxWidth: 100 }}
                  ellipsis={{ tooltip: item.newValue }}
                >{item.newValue}
                </Text> : item.newValue
            }</b></>
          }
          return (
            <div>
              <b style={{ paddingRight: 4 }}>
                {moment(item.createdAt).format('DD/MM/YYYY hh:mm')}
              </b>
              {content}
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

export default OrderDetailsModal;
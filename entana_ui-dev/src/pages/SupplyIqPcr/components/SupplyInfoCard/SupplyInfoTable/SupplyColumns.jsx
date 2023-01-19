import { DatePicker, Typography } from 'antd';
import { CheckSquareFilled, CloseSquareFilled } from '@ant-design/icons';
import moment from 'moment';
import { getUserRole } from 'utils/user';
import { Input } from 'antd';
import { useState } from 'react';


const isSupplier = getUserRole() === 'supplier';

const { TextArea } = Input;
const { Text } = Typography

export default function formatColumns(props) {
  const {
    refetch,
    isEditable,
    updateOrder,
    commodityId,
    columns,
    setSelectedOrder,
    setDisplayOrderInfo,
    updateOrderNow
  } = props
  const defaultColumns = [
    {
      dataIndex: "materialNumber",
      fixed: true,
      render: (text, record) => {
        return (
          <div
            style={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={() => {
              setSelectedOrder(record);
              setDisplayOrderInfo(true);
            }}>{text}
          </div>
        )

      }
    },
    {
      dataIndex: "revision",
    },
    {
      dataIndex: "description",
    },
    {
      dataIndex: "qcPo",
    },
    {
      dataIndex: "docType",
    },
    {
      dataIndex: "scheduleLineKey",
    },
    {
      dataIndex: "docNumber",
    },
    {
      dataIndex: "poQty",
    },
    {
      dataIndex: "openQty",
    },
    {
      dataIndex: "requestedDate",
    },
    {

      title: "Reschedule Date",
      dataIndex: "rescheduleDate",
      // this field should be editable only for commodity manager role
      render: (text, record) => {

        if (isEditable && !isSupplier) {
          return (
            <DatePicker
              defaultValue={record.rescheduleDate ? moment(record.rescheduleDate) : undefined} format={"yyyy-MM-DD"}
              onChange={async (date, dateString) => {
                const variables = {
                  id: record.id,
                  data: {
                    rescheduleDate: dateString ? dateString : null
                  }
                };
                await updateOrder({ variables });
                updateOrderNow({
                  ...record,
                  accepted: null,
                  rescheduleDate: dateString ? dateString : null,
                })
              }}
            />
          )
        }

        return text
      }
    },
    {
      dataIndex: "action",
      render: (text, { requestedDate, rescheduleDate }) => {
        if ( !rescheduleDate || !rescheduleDate) {
          return "Cancel"
        }

        if (rescheduleDate > requestedDate) {
          return "Schedule-out"
        }

        return "Schedule-in";
      }
    },
    {
      dataIndex: "accepted",
      render: (text, record) => {
        // this field should be editable only for commodity manager role
        return (
          <>
            <CheckSquareFilled
              style={{ fontSize: "30px", color: record.accepted ? 'green' : 'gray' }}
              onClick={async () => {
                if ( !isSupplier || !isEditable) return;
                const accepted = record.accepted ? null : true

                const variables = {
                  id: record.id,
                  data: { accepted }
                };
                await updateOrder({ variables });
                updateOrderNow({ ...record, accepted })
              }}
            />
            <CloseSquareFilled
              style={{
                fontSize: "30px",
                color: record.accepted === false ? 'red' : 'gray'
              }}
              onClick={async () => {
                if ( !isSupplier || !isEditable) return;
                const accepted = record.accepted === false ? null : false

                const variables = {
                  id: record.id,
                  data: { accepted }
                };
                updateOrderNow({ ...record, accepted: false })
                await updateOrder({ variables });
                updateOrderNow({ ...record, accepted })
              }}
            />
          </>
        );
      }
    },
    {
      // this field should be editable only for suplier role
      title: "New Date",
      dataIndex: "supplierDate",
      render: (text, record) => {


        if (isEditable && isSupplier) {
          if (record.accepted != null) {
            return (
              <DatePicker
                key={record.id + 'rescheduleDate'}
                disabled={true}
                value={record.rescheduleDate ? moment(record.rescheduleDate) : undefined}
                format={"yyyy-MM-DD"}
              />
            )
          }
          return (
            <DatePicker
              key={record.id + 'supplierDate'}
              disabled={record.accepted != null}
              defaultValue={record.supplierDate ? moment(record.supplierDate) : undefined}
              format={"yyyy-MM-DD"}
              // value={record.supplierDate ? moment(record.supplierDate) : undefined}
              onChange={async (date, dateString) => {
                const variables = {
                  id: record.id,
                  data: {
                    supplierDate: dateString ? dateString : null
                  }
                };
                await updateOrder({ variables });
                // await refetch();
              }}
            />
          )
        }
        return text;
      }
    },
    {
      title: "Remarks",
      dataIndex: "supplierRemarks",
      render: (text, record) => {

        if (isEditable && isSupplier) {
          return (
            <TextArea
              defaultValue={record.supplierRemarks}
              rows={1}
              onBlur={async (event) => {
                const variables = {
                  id: record.id,
                  data: {
                    supplierRemarks: event.target.value ? event.target.value : null
                  }
                };
                await updateOrder({ variables });
                // await refetch();
              }}
            />
          );
        }
        return (
          <Text
            style={{ width: 100 }}
            ellipsis={{ tooltip: text }}
          >
            {text}
          </Text>
        );
      }
    },
  ].map((e, idx) => { return { ...e, must: true } })

  columns.map(e => { return { dataIndex: e } })

    .forEach((e, idx) => {
      if (defaultColumns.find(col => col.dataIndex === e.dataIndex)) {
        return;
      }

      if (e.dataIndex.endsWith("Id") || e.dataIndex == 'id') {
        return
      }
      ;

      defaultColumns.push(e)

    })

  return defaultColumns
    .filter(e => e.dataIndex !== '__typename')
    .map((e, idx) => {
      return {
        title: e.dataIndex.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); }),
        ...e,
      }
    });
}
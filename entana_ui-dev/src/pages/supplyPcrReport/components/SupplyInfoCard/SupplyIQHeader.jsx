import openNotification from 'utils/Notification';
import { Button, Modal, Checkbox, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { getUserRole } from 'utils/user';
import { gql, useMutation } from '@apollo/client';

const isSupplier = getUserRole() === 'supplier';

const NOTIFY_SUPPLIERS = gql`
  mutation notifySuppliers($id: ID!) {
    notifySuppliers(id: $id) {
      message
    }
  }
`;

const NOTIFY_BUYER = gql`
  mutation notifyBuyer($id: ID!) {
    notifyBuyer(id: $id) {
      message
    }
  }
`;

function useNotifySuppliers() {
  const [notifySuppliers] = useMutation(NOTIFY_SUPPLIERS);
  return notifySuppliers;
}

function useNotifyBuyer() {
  const [notifyBuyer] = useMutation(NOTIFY_BUYER);
  return notifyBuyer;
}

const acceptedFilterOptions = [
  {
    label: 'All',
    value: 'all',
    key: 'all'
  },
  {
    label: 'Accepted',
    value: true,
    key: 'accepted'
  },
  {
    label: 'Declined',
    value: false,
    key: 'declined'
  },
  {
    label: 'Pending',
    value: null,
    key: 'pending'
  }
]

export default function SupplyHeader(props) {
  const {
    setCurrentSupplyInfoId,
    currentSupplyInfoId,
    supplyInfo,
  } = props;

  const [notifyLogic] = useNotifyRelatedOrganizations(supplyInfo);

  const supplyOrderInfoOptions = supplyInfo.dateList.map(e => {
    return {
      label: e.date,
      key: e.id,
      value: e.id
    }
  })

  function printHTML(htmlString) {
    const newIframe = document.createElement('iframe');
    newIframe.width = '1px';
    newIframe.height = '1px';
    newIframe.src = 'about:blank';

    // for IE wait for the IFrame to load so we can access contentWindow.document.body
    newIframe.onload = function () {
      const script_tag = newIframe.contentWindow.document.createElement("script");
      script_tag.type = "text/javascript";
      const script = newIframe.contentWindow.document.createTextNode('function Print(){ window.focus(); window.print(); }');
      script_tag.appendChild(script);

      newIframe.contentWindow.document.body.innerHTML = htmlString;
      newIframe.contentWindow.document.body.appendChild(script_tag);

      // for chrome, a timeout for loading large amounts of content
      setTimeout(function () {
        newIframe.contentWindow.print();
        newIframe.contentWindow.document.body.removeChild(script_tag);
        newIframe.parentElement.removeChild(newIframe);
      }, 200);
    };
    document.body.appendChild(newIframe);
  }

  const onPrint = () => {
    console.log("PDF print")
    const headStr = "<html>" + document.getElementsByTagName('head')[ 0 ].innerHTML + "<body>";
    const footStr = "</body>";
    const newStr = document.all.item('supplyPcr' + supplyInfo.id).innerHTML;
    const oldStr = document.body.innerHTML;
    const html = headStr + newStr + footStr;
    printHTML(html)
  }

  return (
    <>
      <div className={'float-right flex gap-3'}>
        {/*<Select*/}
        {/*  options={acceptedFilterOptions}*/}
        {/*  onChange={e => setAcceptedFilter(e)}*/}
        {/*  value={acceptedFilter}*/}
        {/*  className={' w-24'}*/}
        {/*/>*/}
        <Select
          options={supplyOrderInfoOptions}
          onChange={e => setCurrentSupplyInfoId(e)}
          value={parseInt(currentSupplyInfoId)}
        />

        <Button onClick={onPrint}>
          Print to PDF
        </Button>
        <Button onClick={notifyLogic} type="primary">
          Send To Suppliers
        </Button>
      </div>
    </>
  )
}


const useNotifyRelatedOrganizations = (SupplyInfo) => {

  const notifySuppliers = useNotifySuppliers();
  const notifyBuyer = useNotifyBuyer();

  function notifyLogic() {
    return false;
    if (isSupplier) {
      // add notify buyer api call
      const variables = { id: SupplyInfo.id };
      notifyBuyer({ variables })
        .then(() => {
          openNotification('success', 'Buyer notified succcessfully');
        })
        .catch((error) => {
          openNotification('error', 'Error while sending notification');
        });
    } else {
      const variables = { id: SupplyInfo.id };
      notifySuppliers({ variables })
        .then(() => {
          openNotification('success', 'Suppliers notified succcessfully');
        })
        .catch((error) => {
          openNotification('error', 'Error while sending notification');
        });
    }
  };

  return [notifyLogic]
}


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
        history,
        columns,
        setPanelOpen,
        setDisplayColumns,
        setCurrentSupplyInfoId,
        currentSupplyInfoId,
        supplyInfo,
        acceptedFilter, setAcceptedFilter
    } = props;
    const [isModalVisible, setModalVisible] = useState(false);
    const [notifyLogic] = useNotifyRelatedOrganizations(supplyInfo);


    function onUpdateColumns() {
        // update columns
        setPanelOpen(supplyInfo.id)
        setModalVisible(true)
    }

    const supplyOrderInfoOptions = history.map(e => {
        return {
            label: e.date,
            key: e.id,
            value: e.id
        }
    })

    return (
        <>
            <div className={'float-right flex gap-3'}>
                <Select 
                    options={acceptedFilterOptions}
                    onChange={e => setAcceptedFilter(e)}
                    value={acceptedFilter}
                    className={' w-24'}
                /> 
                <Select
                    options={supplyOrderInfoOptions}
                    onChange={e => setCurrentSupplyInfoId(e)}
                    value={parseInt(currentSupplyInfoId)}
                />

                <Button onClick={onUpdateColumns} >Add/Remove Columns</Button>
                <Button onClick={notifyLogic} type="primary">
                    {isSupplier ? 'Notify buyer' : 'Notify Suppliers'}
                </Button>
            </div>
            <ModalView open={isModalVisible} setVisible={setModalVisible} columns={columns} setDisplayColumns={setDisplayColumns} />
        </>
    )
}

const ModalView = (props) => {
    const { open, setVisible, columns, setDisplayColumns } = props;
    const [checkList, setCheckList] = useState([])

    useEffect(() => {
        setCheckList(columns
            .filter(e => e.must)
            .map((_, idx) => idx)
        )
    }, [columns])

    function onApplyColumnChange() {
        setVisible(false)
        setDisplayColumns(checkList)
    }

    return (
        <Modal
            title="Add/Remove Columns View"
            open={open}
            onOk={onApplyColumnChange}
            onCancel={() => setVisible(false)}
            centered
        >
            <h2>Check/Uncheck Column to change display</h2>
            <Checkbox.Group className={'flex flex-col gap-3'} value={checkList} onChange={e => setCheckList(e)}>
                {columns
                    .map((e, idx) => (
                        <Checkbox value={idx} key={idx} className={'ml-0'} disabled={e.must}>{e.title}</Checkbox>
                    ))
                }
            </Checkbox.Group>
        </Modal>
    )

}

const useNotifyRelatedOrganizations = (SupplyInfo) => {

    const notifySuppliers = useNotifySuppliers();
    const notifyBuyer = useNotifyBuyer();

    function notifyLogic() {
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


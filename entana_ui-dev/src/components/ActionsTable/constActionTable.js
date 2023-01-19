import React, { useState } from 'react'
import { Popover, Modal } from "antd";
import { CheckCircleFilled, DeleteFilled, EditFilled, PlusCircleFilled } from '@ant-design/icons';
import './actionsTable.css'
import Edit from 'components/CRUDPopup/Edit'

const ReachableContext = React.createContext();
const UnreachableContext = React.createContext();
const config = {
  title: 'Are You Sure to delete Data',
  content: (
    <>
    </>
  ),
};

export default function ConstActionsTable({ text, record }) {

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState();

  const [modal, contextHolder] = Modal.useModal();

  const handleEdit = (value) => {
    setIsEdit(value)
    showModal()
  }

  const showModal = () => {
    setIsModalVisible(!isModalVisible);
  };


  const content = () => {
    return (
      <div className='crud-icons'>
        <EditFilled className='edit-icon-color' onClick={() => handleEdit(true)} />
        <PlusCircleFilled className='add-icon-color' onClick={() => handleEdit(false)} />
        <DeleteFilled className='delete-icon-color' onClick={() => {
          modal.confirm(config);
        }} />
        <CheckCircleFilled className='CheckCircle-icon-color' />
      </div>
    )
  }

  return (
    <ReachableContext.Provider value="Light">
      <Modal className='edit-modal' visible={isModalVisible} onOk={showModal} onCancel={showModal}>
        <Edit
          title={isEdit ? 'Edit' : 'Add'}
        />
      </Modal>
      <span className='action-popover-button'>
        <Popover overlayClassName='actions' placement="bottom" content={content} trigger="hover">
          ...
        </Popover>
      </span>
      {contextHolder}
      <UnreachableContext.Provider value="Bamboo" />
    </ReachableContext.Provider>
  )
}


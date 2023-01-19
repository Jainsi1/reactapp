import React, { useState } from "react";
import { Modal, Button, Table } from "antd";
import Widget from "components/Widget";
import { PlusOutlined } from "@ant-design/icons";

import "./tableCard.css";

const TableCard = ({ title, data = [], columns = [], displayAddCTA = false }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleAdd = () => {
    setIsModalVisible(true);
  };

  const handleSubmit = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onDeleteRecord = (record) => {
    setIsModalVisible(false);
  };

  return (
    <Widget>
      <div className="table-title">
        <h4 className="tableHeaderTitle">{title}</h4>
      </div>
      <div className="add-row-button">
        {displayAddCTA && (
          <Button
            onClick={handleAdd}
            type="primary"
            style={{
              marginBottom: 16,
            }}
          >
            <PlusOutlined /> Add
          </Button>
        )}
        <Modal
          title="Add New Row"
          open={isModalVisible}
          onOk={handleSubmit}
          okText="Submit"
          onCancel={handleCancel}
          centered
        >
          <p>Some contents...</p>
        </Modal>
      </div>
      <Table
        columns={columns}
        rowKey={(record) => record.no}
        expandable={{
          expandedRowRender: (record) => (
            <div className="expanded-table-div">{record.tasks}</div>
          ),
          rowExpandable: (record) => record.expand === true,
        }}
        dataSource={data}
        size="small"
        pagination={false}
        scroll={{ x: true }}
      />
    </Widget>
  );
};

export default TableCard;

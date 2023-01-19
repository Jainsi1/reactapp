import React, { useState, useEffect } from 'react';
import { 
  Modal,
  Button,
  Table,
  Input,
  Form
} from 'antd';
import Widget from 'components/Widget';
import { getUserId } from 'utils/user';
import { 
  PlusOutlined,
  EditOutlined,
  DeleteOutlined 
} from '@ant-design/icons';
import {
  tableTitle,
  tableLeadText
} from 'utils/table';
import businessTable from 'components/TableTag/businessTable';

import InitiativeExpandedRow from 'components/InitiativeExpandedRow';

import './tableCard.css';

import { gql, useMutation } from "@apollo/client";

const CREATE_INITIATIVE = gql`
  mutation createInitiative($data: InitiativeCreateInput!) {
    createInitiative(data: $data) {
      Id: id
      relatedOrgId
      commodityId
      type
      title
      plan
      current
      businessObjective
      expectedBenefit
      ownerId
      status
    }
  }
`;

const UPDATE_INITIATIVE = gql`
  mutation updateInitiative(
    $data: InitiativeUpdateInput
    $where: InitiativeWhereUniqueInput!
  ) {
    updateInitiative(data: $data, where: $where) {
      Id: id
      relatedOrgId
      commodityId
      type
      title
      plan
      current
      businessObjective
      expectedBenefit
      ownerId
      status
    }
  }
`;

const DELETE_INITIATIVE = gql`
  mutation deleteInitiative($where: InitiativeDeleteInput!) {
    deleteInitiative(where: $where) {
      Id: id
    }
  }
`;

export function useUpdateInitiative() {
  const [updateInitiative] = useMutation(UPDATE_INITIATIVE);
  return updateInitiative;
}

export function useCreateInitiative() {
  const [createInitiative] = useMutation(CREATE_INITIATIVE);
  return createInitiative;
}

export function useDeleteInitiative() {
  const [deleteInitiative] = useMutation(DELETE_INITIATIVE);
  return deleteInitiative;
}



export default function BusinessTableCard({
  title,
  data = [],
  selectedCommodity,
  relatedOrg,
  onInitiativesChanged
}) {
  const [editForm] = Form.useForm();
  const [addForm] = Form.useForm();
  const [dataSource, setDataSource] = useState(data);
  const [oldDataSource, setOldDataSource] = useState(data);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const deleteInitiative = useDeleteInitiative();
  const createInitiative = useCreateInitiative();
  const updateInitiative = useUpdateInitiative();
  let isRTB = title === "Run The Business";

  const setOldData = () => {
    const oldData = oldDataSource.map((initiative) => ({ ...initiative }));
    setDataSource(undefined);
    setDataSource(oldData);
  };

  const onDeleteRecord = (record) => {
    Modal.confirm({
      title: "Are you sure you want to delete this initiative?",
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: async () => {
        const variables = { where: { id: record.no } };
        await deleteInitiative({ variables })
          .then(() => {
            setDataSource((pre) => {
              return pre.filter((initiative) => initiative.no !== record.no);
            });
            onInitiativesChanged();
          })
          .catch(setOldData);
      },
    });
  };

  const onEditRecord = (record) => {
    setEditingRecord({ ...record });
    setEditModalVisible(true);
    editForm.setFieldsValue({
      title: record.title,
      businessObjective: record.businessObjective,
      lead: record.lead,
      plan: record.plan,
      current: record.current,
      expectedBenefit: record.expectedBenefit,
    });
  };

  const handleEditCancel = () => {
    setEditingRecord(null);
    setEditModalVisible(false);
  };
  const handleEditSave = async (record) => {
    const data = {
      title: editingRecord.title,
      businessObjective: editingRecord.businessObjective,
      expectedBenefit: editingRecord.expectedBenefit,
      plan: editingRecord.plan,
      current: editingRecord.current,
      ownerId: getUserId(),
    };
    const variables = { data, where: { id: editingRecord.no } };
    await updateInitiative({ variables })
      .then(() => {
        const oldData = dataSource.map((initiative) => ({ ...initiative }));
        setOldDataSource(oldData);
        const updatedData = dataSource.map((initiative) => {
          if (initiative.no === editingRecord.no) {
            return editingRecord;
          } else {
            return initiative;
          }
        });
        setDataSource(updatedData);
        onInitiativesChanged();
      })
      .catch(setOldData);
    setEditModalVisible(false);
    setEditingRecord(null);
    editForm.resetFields();
  };

  const onAddRecord = () => {
    setAddModalVisible(true);
  };
  const handleAddCancel = () => {
    setAddModalVisible(false);
  };

  const handleAddSave = async (entry) => {
    const data = {
      title: entry.title,
      businessObjective: entry.businessObjective,
      expectedBenefit: entry.expectedBenefit,
      plan: entry.plan,
      current: entry.current,
      ownerId: getUserId(),
      commodityId: `${selectedCommodity}`,
      relatedOrgId: `${relatedOrg}`,
      type: isRTB ? "RTB" : "CTB",
    };
    const variables = { data };
    await createInitiative({ variables })
      .then(({ data }) => {
        const oldData = oldDataSource.map((initiative) => ({ ...initiative }));
        oldData.push(data.createInitiative);
        setDataSource(oldData);
        const oldDataCopy = oldData.map((initiative) => ({ ...initiative }));
        setOldDataSource(oldDataCopy);
        onInitiativesChanged();
      })
      .catch(setOldData);
    setAddModalVisible(false);
  };

  useEffect(() => {
    if (!!data) {
      const dataSource = data?.map((initiative) => {
        return { ...initiative };
      });

      const oldDataSource = data?.map((initiative) => {
        return { ...initiative };
      });

      setDataSource(dataSource);
      setOldDataSource(oldDataSource);
    }
  }, [data]);

  const BusinessColumns = [
    {
      title: "#",
      dataIndex: "no",
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: "TITLE",
      dataIndex: "title",
      render: tableTitle,
    },
    {
      title: "BUSINESS OBJECTIVE",
      dataIndex: "businessObjective",
      className: "tableDataText",
    },
    {
      title: "EXPECTED BENEFITS",
      dataIndex: "expectedBenefit",
      className: "tableDataText",
    },
    {
      title: "LEAD",
      dataIndex: "lead",
      render: tableLeadText,
    },
    {
      title: "PLAN",
      dataIndex: "plan",
      className: "tableDataText",
    },
    {
      title: "CURRENT",
      dataIndex: "current",
      render: businessTable,
    },
    {
      title: "COMMODITY",
      dataIndex : "commodityId",
    },
    {
      title: "ACTIONS",
      dataIndex: "actions",
      render: (text, record) => {
        return (
          <>
            <EditOutlined
              style={{ marginLeft: 12 }}
              onClick={() => {
                onEditRecord(record);
              }}
            />
            <DeleteOutlined
              style={{ color: "red", marginLeft: 12 }}
              onClick={() => {
                onDeleteRecord(record);
              }}
            />
          </>
        );
      },
    },
  ]; 

  const renderEditInitiativeModal = () => (
    <Modal
      title="Edit Initiative"
      visible={isEditModalVisible}
      onCancel={handleEditCancel}
      onOk={editForm.submit}
      okText="Save"
    >
      <Form
        form={editForm}
        layout="vertical"
        name="form_in_modal"
        onFinish={handleEditSave}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[
            {
              required: true,
              message: "Please add a name for the initiative!",
            },
          ]}
        >
          <Input
            onChange={(e) => {
              setEditingRecord((pre) => {
                return { ...pre, title: e.target.value };
              });
            }}
          />
        </Form.Item>
        <Form.Item name="businessObjective" label="Business Objective">
          <Input
            type="textarea"
            onChange={(e) => {
              setEditingRecord((pre) => {
                return { ...pre, businessObjective: e.target.value };
              });
            }}
          />
        </Form.Item>
        <Form.Item name="expectedBenefit" label="Expected Benefits">
          <Input
            type="textarea"
            onChange={(e) => {
              setEditingRecord((pre) => {
                return { ...pre, expectedBenefit: e.target.value };
              });
            }}
          />
        </Form.Item>
        <Form.Item name="lead" label="Lead">
          <Input
            type="textarea"
            onChange={(e) => {
              setEditingRecord((pre) => {
                return { ...pre, lead: e.target.value };
              });
            }}
          />
        </Form.Item>
        <Form.Item
          name="plan"
          label="Plan"
          rules={[
            {
              required: true,
              message: "Mandatory field",
            },
          ]}
        >
          <Input
            type="textarea"
            onChange={(e) => {
              setEditingRecord((pre) => {
                return { ...pre, plan: e.target.value };
              });
            }}
          />
        </Form.Item>
        <Form.Item
          name="current"
          label="Current"
          rules={[
            {
              required: true,
              message: "Mandatory field",
            },
          ]}
        >
          <Input
            type="textarea"
            onChange={(e) => {
              setEditingRecord((pre) => {
                return { ...pre, current: e.target.value };
              });
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );

  const renderCreateInitiativeModal = () => (
    <Modal
      title="Create a New Initiative"
      onOk={addForm.submit}
      onCancel={handleAddCancel}
      visible={isAddModalVisible}
      okText="Save"
    >
      <Form
        form={addForm}
        layout="vertical"
        name="form_in_modal"
        onFinish={handleAddSave}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[
            {
              required: true,
              message: "Please add a name for the initiative!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="businessObjective" label="Business Objective">
          <Input type="textarea" />
        </Form.Item>
        <Form.Item name="expectedBenefit" label="Expected Benefits">
          <Input type="textarea" />
        </Form.Item>
        <Form.Item
          name="lead"
          label="Lead"
          rules={[
            {
              required: true,
              message: "Mandatory field",
            },
          ]}
        >
          <Input type="textarea" />
        </Form.Item>
        {/* <Form.Item name="lob" label="LOB">
          <Input type="textarea" />
        </Form.Item> */}
        <Form.Item
          name="plan"
          label="Plan"
          rules={[
            {
              required: true,
              message: "Mandatory field",
            },
          ]}
        >
          <Input type="textarea" />
        </Form.Item>
        <Form.Item
          name="current"
          label="Current"
          rules={[
            {
              required: true,
              message: "Mandatory field",
            },
          ]}
        >
          <Input type="textarea" />
        </Form.Item>
      </Form>
    </Modal>
  );

  return (
    <Widget>
      <div className="table-title">
        <h4 className="tableHeaderTitle">{title}</h4>
      </div>
      <div className="add-row-button">
        <Button
          type="primary"
          onClick={onAddRecord}
          style={{
            marginBottom: 16,
          }}
        >
          <PlusOutlined /> Add
        </Button>
      </div>
      <Table
        columns={BusinessColumns}
        rowKey={(record) => record.no}
        expandable={{
          expandedRowRender: (record) => (
            <InitiativeExpandedRow 
              initiativeId={record.no}
              selectedCommodity={selectedCommodity}
              relatedOrg={relatedOrg}
            />
          ),
          rowExpandable: () => true,
        }}
        dataSource={dataSource}
        size="middle"
        scroll={{ x: true }}
        pagination={false}
      />
      {renderEditInitiativeModal()}
      {renderCreateInitiativeModal()}
    </Widget>
  );
}

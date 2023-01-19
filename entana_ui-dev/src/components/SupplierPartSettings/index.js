import React, { useState } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import Drawer from '@mui/material/Drawer';
import { 
  CloseOutlined
} from '@ant-design/icons';
import { GET_SUPPLIER_PARTS, GET_SUPPLIER_PART_ROADMAP } from './graphql/query';
import { Space, Table, Button, Form, Modal, Select, Input, DatePicker, Switch, InputNumber } from 'antd';
import {
  tableDataText
} from 'utils/table';
import { 
  EditOutlined
} from '@ant-design/icons';
import {
  useCreateSupplierPart,
  useUpdateSupplierPart,
  useCreateSupplierPartRoadmap,
  useUpdateSupplierPartRoadmap
} from './graphql/mutation';
import moment from 'moment'

const { Option } = Select;

const getSupplierParts = (supplierParts) => {
  if(!supplierParts) return [];

  return supplierParts.map(part => {
    return {
      ...part,
      key: part.id
    }
  })
};

const SupplierPartSettings = ({ supplierProduct, onDrawerClose }) => {
  const createSupplierPart = useCreateSupplierPart();
  const updateSupplierPart = useUpdateSupplierPart();
  const createSupplierPartRoadmap = useCreateSupplierPartRoadmap();
  const updateSupplierPartRoadmap = useUpdateSupplierPartRoadmap();
  const [displaySupplierPartModal, setDisplaySupplierPartModal] = useState(false);
  const [displayRoadmapModal, setDisplayRoadmapModal] = useState(false);
  const [partForm] = Form.useForm();
  const [form] = Form.useForm();
  const [isPartUpdateMode, setIsPartUpdateMode] = useState(false);
  const [selectedSuppplierPart, setSelectedSupplierPart] = useState(undefined);
  const { data, error, refetch: refetchSupplierParts } = useQuery(GET_SUPPLIER_PARTS, {
    fetchPolicy: "network-only",
    variables: {
      productId: supplierProduct?.id
    }
  });

  const { data: successorPartData, error: successorPartError } = 
  useQuery(GET_SUPPLIER_PARTS, {
    fetchPolicy: "network-only",
    variables: {
      productId: supplierProduct?.successorId
    },
    skip: !supplierProduct?.successorId
  });

  const [
    getSupplierPartRoadmap,
    { loading: roadmapLoading, error: roadmapError, data: roadmapData },
  ] = useLazyQuery(GET_SUPPLIER_PART_ROADMAP, {
    fetchPolicy: "network-only",
  });

  const toggleRoadmapModal = () => {
    setDisplayRoadmapModal(!displayRoadmapModal);
  };

  const SupplierPartColumns = [
    {
      title: "#",
      dataIndex: "no",
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: "Name",
      dataIndex: "partName",
      render: tableDataText,
    },
    {
      title: "Roadmap",
      dataIndex: "roadmap",
      render: (text, record) => <a onClick={async () => {
        await getSupplierPartRoadmap({
          variables: {
            supplierPartId: record.id
          },
        });
        setSelectedSupplierPart(record);
        toggleRoadmapModal();
      }} >roadmap</a>
    },
    {
      title: "ACTIONS",
      dataIndex: "actions",
      render: (text, record) => {
        return (
          <>
            <EditOutlined
              style={{ marginLeft: 12 }}
              onClick={async () => {
                setIsPartUpdateMode(true);
                setSelectedSupplierPart(record);
                setDisplaySupplierPartModal(!displaySupplierPartModal);
              }}
            />
          </>
        );
      },
    },
  ];

  const resetState = () => {
    setDisplaySupplierPartModal(!displaySupplierPartModal);
    setIsPartUpdateMode(false);
    setSelectedSupplierPart(undefined);  
  };

  const onFinish = async (values) => {
    const data = {
      partName: values.partName,
      productId: supplierProduct.id
    }
    const variables = { data };

    if (isPartUpdateMode) {
      variables.data.successorId = values.successorId;
      variables.id = selectedSuppplierPart.id;
      await updateSupplierPart({ variables })
        .then(() => {
          resetState();
          refetchSupplierParts();
        })
        .catch(error => { console.log(error) });
    } else {
      await createSupplierPart({ variables })
      .then(() => {
        resetState();
        refetchSupplierParts();
      })
      .catch(error => { console.log(error) });
    }
  };

  const renderSupplierPartModal = () => {
    partForm.setFieldsValue(
      isPartUpdateMode ?
      selectedSuppplierPart : 
      {
        partName: '',
        successorId: undefined
      }
    );

    return (
      <Modal
        zIndex={10000}
        footer={null}
        title={isPartUpdateMode ? 'Update product' : "Add product"} 
        visible={displaySupplierPartModal}
        onCancel={resetState} >
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          onFinish={onFinish}
          onFinishFailed={() => {}}
          autoComplete="off"
          form={partForm}
        >
          <Form.Item
            label="Part name"
            name="partName"
            rules={[
              {
                required: true,
                message: 'Please input part name',
              },
            ]}
          >
            <Input />
          </Form.Item>
          {
            isPartUpdateMode && (
              <Form.Item
                label="Successor part"
                name="successorId"
              >
                <Select
                  dropdownStyle={{ zIndex: 10000 }}
                  placeholder="Select successor"
                  onChange={() => {}}
                >
                  {successorPartData?.getSupplierParts?.map((supplierPart) => (
                    <Option key={supplierPart.id} value={supplierPart.id}>{supplierPart.partName}</Option>
                  ))}
                </Select>
              </Form.Item>
            )
          }
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  const onRoadmapSave = async (values, mode) => {
    const data = {
      ...values,
      es1Date: values.es1Date?.format('YYYY-MM-DD'),
      es2Date: values.es2Date?.format('YYYY-MM-DD'),
      es3Date: values.es3Date?.format('YYYY-MM-DD'),
      qualStartDate: values.qualStartDate?.format('YYYY-MM-DD'),
      milestone1Date: values.milestone1Date?.format('YYYY-MM-DD'),
      milestone2Date: values.milestone2Date?.format('YYYY-MM-DD'),
      milestone3Date: values.milestone3Date?.format('YYYY-MM-DD'),
      milestone4Date: values.milestone4Date?.format('YYYY-MM-DD'),
      qualFinishDate: values.qualFinishDate?.format('YYYY-MM-DD'),
      rts: values.rts?.format('YYYY-MM-DD'),
      rtm: values.rtm?.format('YYYY-MM-DD'),
      ltb: values.ltb?.format('YYYY-MM-DD'),
      lts: values.lts?.format('YYYY-MM-DD')
    }
    const variables = { data };
    if (mode === 'create') {
      variables.data.supplierPartId = selectedSuppplierPart.id;
      await createSupplierPartRoadmap({ variables })
        .then(() => {
          toggleRoadmapModal();
          setSelectedSupplierPart(undefined);
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      variables.supplierPartRoadmapId = roadmapData.getSupplierPartRoadmap.id;
      await updateSupplierPartRoadmap({ variables })
        .then(() => {
          toggleRoadmapModal();
          setSelectedSupplierPart(undefined);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  const renderRoadmapModal = () => {
    const roadmap = roadmapData?.getSupplierPartRoadmap;
    const mode = roadmap === null ? 'create' : 'update';
    
    const data = {
      ...roadmap,
      es1Date: roadmap?.es1Date ? moment(roadmap?.es1Date) : undefined,
      es2Date: roadmap?.es2Date ? moment(roadmap?.es2Date) : undefined,
      es3Date: roadmap?.es3Date ? moment(roadmap?.es3Date) : undefined,
      qualStartDate: roadmap?.qualStartDate ? moment(roadmap?.qualStartDate) : undefined,
      milestone1Date: roadmap?.milestone1Date ? moment(roadmap?.milestone1Date) : undefined,
      milestone2Date: roadmap?.milestone2Date ? moment(roadmap?.milestone2Date) : undefined,
      milestone3Date: roadmap?.milestone3Date ? moment(roadmap?.milestone3Date) : undefined,
      milestone4Date: roadmap?.milestone4Date ? moment(roadmap?.milestone4Date) : undefined,
      qualFinishDate: roadmap?.qualFinishDate ? moment(roadmap?.qualFinishDate) : undefined,
      rts: roadmap?.rts ? moment(roadmap?.rts) : undefined,
      rtm: roadmap?.rtm ? moment(roadmap?.rtm) : undefined,
      ltb: roadmap?.ltb ? moment(roadmap?.ltb) : undefined,
      lts: roadmap?.lts ? moment(roadmap?.lts) : undefined,
      standardLeadTime: roadmap?.standardLeadTime ? roadmap.standardLeadTime : undefined,
      currentLeadTime: roadmap?.currentLeadTime ? roadmap.currentLeadTime : undefined,
      isPor: (roadmap?.isPor !== undefined && roadmap?.isPor !== null) ? roadmap.isPor : undefined,
      needsUserAttention: (roadmap?.needsUserAttention !== undefined && roadmap?.needsUserAttention !== null) ? roadmap.needsUserAttention : undefined,
    }
    form.setFieldsValue(data);
    return (
      <Modal zIndex={10000} footer={null} title={"Roadmap"} visible={displayRoadmapModal} onCancel={toggleRoadmapModal} >
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          onFinish={(values) => {
            onRoadmapSave(values, mode);
          }}
          onFinishFailed={() => {}}
          autoComplete="off"
          form={form}
        >
          <Form.Item name="es1Date" label="ES1">
            <DatePicker popupStyle={{ zIndex: 100000 }} />
          </Form.Item>
          <Form.Item name="es2Date" label="ES2">
            <DatePicker popupStyle={{ zIndex: 100000 }} />
          </Form.Item>
          <Form.Item name="es3Date" label="ES3">
            <DatePicker popupStyle={{ zIndex: 100000 }} />
          </Form.Item>
          <Form.Item name="qualStartDate" label="Qual start">
            <DatePicker popupStyle={{ zIndex: 100000 }} />
          </Form.Item>
          <Form.Item name="milestone1Date" label="Milestone 1">
            <DatePicker popupStyle={{ zIndex: 100000 }} />
          </Form.Item>
          <Form.Item name="milestone2Date" label="Milestone 2">
            <DatePicker popupStyle={{ zIndex: 100000 }} />
          </Form.Item>
          <Form.Item name="milestone3Date" label="Milestone 3">
            <DatePicker popupStyle={{ zIndex: 100000 }} />
          </Form.Item>
          <Form.Item name="milestone4Date" label="Milestone 4">
            <DatePicker popupStyle={{ zIndex: 100000 }} />
          </Form.Item>
          <Form.Item name="qualFinishDate" label="Qual finish">
            <DatePicker popupStyle={{ zIndex: 100000 }} />
          </Form.Item>
          <Form.Item name="rts" label="RTS">
            <DatePicker popupStyle={{ zIndex: 100000 }} />
          </Form.Item>
          <Form.Item name="rtm" label="RTM">
            <DatePicker popupStyle={{ zIndex: 100000 }} />
          </Form.Item>
          <Form.Item name="ltb" label="LTB">
            <DatePicker popupStyle={{ zIndex: 100000 }} />
          </Form.Item>
          <Form.Item name="lts" label="LTS">
            <DatePicker popupStyle={{ zIndex: 100000 }} />
          </Form.Item>
          <Form.Item
            label="Current lead time"
            name="currentLeadTime"
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            label="Standard lead time"
            name="standardLeadTime"
          >
            <InputNumber />
          </Form.Item>
          <Form.Item name="needsUserAttention" label="Need user attention" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="isPor" label="POR" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    );
  }

  const supplierParts = getSupplierParts(data?.getSupplierParts);
  return (
    <>
      <Drawer
        anchor={"right"}
        open={true}
        onClose={onDrawerClose}
        PaperProps={{
          sx: { minWidth: "400px" },
        }}
      >
        <Space>
          <CloseOutlined onClick={onDrawerClose} />
        </Space>
        <Button style={{ marginBottom: "10px" }} type="primary" onClick={() => setDisplaySupplierPartModal(true)}>Add part</Button>
        {displaySupplierPartModal && renderSupplierPartModal()}
        {displayRoadmapModal && renderRoadmapModal()}
        {
          supplierParts.length > 0 && (
            <Table
              style={{ paddingLeft: '50px', paddingRight: '50px' }}
              columns={SupplierPartColumns}
              rowKey={(record) => record.key}
              expandable={{
                rowExpandable: () => false,
              }}
              dataSource={supplierParts}
              size="small"
              scroll={{ x: true }}
              pagination={false}
            />
          )
        }
      </Drawer>
    </>
  );
};

export default SupplierPartSettings;
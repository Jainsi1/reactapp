import React, { useState } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import Drawer from '@mui/material/Drawer';
import { 
  CloseOutlined
} from '@ant-design/icons';
import { Space, Table, Button, Form, Modal, Select, Input, DatePicker, Switch, InputNumber } from 'antd';
import {
  tableDataText
} from 'utils/table';
import { 
  GET_CUSTOMER_PART_BY_PRODUCT,
  GET_SUPPLIER_PARTS,
  GET_CUSTOMER_PART_ROADMAP
} from './graphql/query';
import {
  useCreateCustomerPart,
  useUpdateCustomerPart,
  useCreateCustomerPartRoadmap,
  useUpdateCustomerPartRoadmap
} from './graphql/mutation';
import { 
  EditOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;

const getCustomerParts = (customerParts) => {
  if(!customerParts) return [];

  return customerParts.map(part => {
    return {
      ...part,
      key: part.id
    }
  })
};

const CustomerPartSettings = ({ customerProduct, onDrawerClose }) => {
  const createCustomerPart = useCreateCustomerPart();
  const updateCustomerPart = useUpdateCustomerPart();
  const createCustomerPartRoadmap = useCreateCustomerPartRoadmap();
  const updateCustomerPartRoadmap = useUpdateCustomerPartRoadmap();
  const [customerPartForm] = Form.useForm();
  const [form] = Form.useForm();
  const [isPartUpdateMode, setIsPartUpdateMode] = useState(false);
  const [selectedCustomerPart, setSelectedCustomerPart] = useState(undefined);
  const [visible, setVisible] = useState(false);
  const [displayRoadmapModal, setDisplayRoadmapModal] = useState(false);
  const [selectedCustomerPartId, setSelectedCustomerPartId] = useState(undefined);
  const { data, loading, error, refetch: refetchCusomterParts } = useQuery(GET_CUSTOMER_PART_BY_PRODUCT, {
    variables: { customerProductId: customerProduct.id },
    fetchPolicy: 'network-only'
  });

  const [
    getCustomerPartRoadmap,
    { loading: roadmapLoading, error: roadmapError, data: roadmapData },
  ] = useLazyQuery(GET_CUSTOMER_PART_ROADMAP, {
    fetchPolicy: "network-only",
  });

  const CustomerPartColumns = [
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
        await getCustomerPartRoadmap({
          variables: {
            customerPartId: record.id
          },
        });
        setSelectedCustomerPartId(record.id);
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
                setSelectedCustomerPart(record);
                setVisible(true);
              }}
            />
          </>
        );
      },
    },
  ];

  const { 
    data: successorCustomerPartsData, 
    loading: successorCustomerPartsLoading, 
    error: successorCustomerPartsError
  } = useQuery(GET_CUSTOMER_PART_BY_PRODUCT, {
    variables: { customerProductId: customerProduct.successorId },
    fetchPolicy: 'network-only',
    skip: !customerProduct?.successorId
  });

  const { data: supplierPartsData, loading: supplierPartsLoading, error: supplierPartsError } = useQuery(GET_SUPPLIER_PARTS, {
    fetchPolicy: "network-only",
    variables: {
      productId: customerProduct.supplierProduct.id
    }
  });
  
  const onAddCustomerPart = async (values) => {
    const data = {
      partName: values.partName,
      supplierPartId: values.supplierPartId,
      customerProductId: customerProduct.id
    }
    const variables = { data };
    if (isPartUpdateMode) {
      variables.data.successorId = values.successorId;
      variables.id = selectedCustomerPart.id;
      await updateCustomerPart({ variables })
      .then(() => {
        setVisible(false);
        setSelectedCustomerPart(undefined);
        setIsPartUpdateMode(false);
      })
      .catch(error => {
        console.log(error);
      });
    } else {
      await createCustomerPart({ variables })
      .then(() => {
        setVisible(false);
        refetchCusomterParts();
      })
      .catch(error => {
        console.log(error);
      });
    }
  };

  const renderCustomerPartModal = () => {
    customerPartForm.setFieldsValue(
      isPartUpdateMode ?
      selectedCustomerPart : 
      {
        supplierPartId: undefined,
        partName: '',
        successorId: undefined
      }
    );
    return (
      <Modal
        zIndex={10000}
        footer={null}
        title={isPartUpdateMode ? 'Update part' : 'Add part'} 
        visible={visible} 
        onCancel={() => {
          setVisible(false);
          setIsPartUpdateMode(false);
          setSelectedCustomerPart(undefined);
        }}>
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          onFinish={onAddCustomerPart}
          onFinishFailed={() => {}}
          autoComplete="off"
          form={customerPartForm}
        > 
          <Form.Item
            label="Supplier part"
            name="supplierPartId"
            rules={[
              {
                required: true,
                message: 'Please input supplier part',
              },
            ]}
          >
            <Select
              dropdownStyle={{ zIndex: 10000 }}
              placeholder="Select supplier part"
              disabled={isPartUpdateMode}
              onChange={() => {}}
            >
              {supplierPartsData?.getSupplierParts.map((supplierPart) => (
                <Option key={supplierPart.id} value={supplierPart.id}>{supplierPart.partName}</Option>
              ))}
            </Select>
          </Form.Item>
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
          {isPartUpdateMode && (
            <Form.Item
              label="Successor part"
              name="successorId"
            >
              <Select
                dropdownStyle={{ zIndex: 10000 }}
                placeholder="Select successor"
                onChange={() => {}}
              >
                {successorCustomerPartsData?.getCustomerPartByProduct?.map((option) => (
                  <Option key={option.id} value={option.id}>{option.partName}</Option>
                ))}
              </Select>
            </Form.Item>
          )}
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

  const toggleRoadmapModal = () => {
    setDisplayRoadmapModal(!displayRoadmapModal);
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
      variables.data.customerPartId = selectedCustomerPartId;
      await createCustomerPartRoadmap({ variables })
        .then(() => {
          toggleRoadmapModal();
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      variables.customerPartRoadmapId = roadmapData.getCustomerPartRoadmap.id;
      await updateCustomerPartRoadmap({ variables })
        .then(() => {
          toggleRoadmapModal();
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  const onRoadmapSaveFailed = () => {

  }

  const renderRoadmapModal = () => { 
    const roadmap = roadmapData?.getCustomerPartRoadmap;
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
          initialValues={{
            remember: false,
          }}
          onFinish={(values) => {
            onRoadmapSave(values, mode);
          }}
          onFinishFailed={onRoadmapSaveFailed}
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

  const customerParts = getCustomerParts(data?.getCustomerPartByProduct);
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
        <Button style={{ marginBottom: "10px" }} type="primary" onClick={() => setVisible(true)}>Add customer part</Button>
        {
          visible && (
            renderCustomerPartModal()
          )
        }
        {
          displayRoadmapModal && (
            renderRoadmapModal()
          )
        }
        {
          customerParts.length > 0 && (
            <Table
              style={{ paddingLeft: '50px', paddingRight: '50px' }}
              columns={CustomerPartColumns}
              rowKey={(record) => record.key}
              expandable={{
                rowExpandable: () => false,
              }}
              dataSource={customerParts}
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

export default CustomerPartSettings;
import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Button, Modal, Form, Input, Select, Table } from 'antd';
import { GET_PRODUCTS } from './graphql/query';
import {
  useCreateProduct,
  useUpdateProduct,
} from './graphql/mutation';
import { getOrganizationId } from 'utils/user';
import {
  tableDataText
} from 'utils/table';
import { 
  EditOutlined
} from '@ant-design/icons';
import SupplierPartSettings from 'components/SupplierPartSettings';

import './supplierSettings.css';

const orgId = getOrganizationId();
const { Option } = Select;

const getProductsData = (products) => {
  if (!products) return [];
  
  const productsData = products.map(product => {
    return {
      ...product,
      key: product.id,
      productFamily: product.productFamily,
      productFamilyFriendlyName: product.productFamilyFriendlyName
    }
  });
  
  return productsData;
};

const SupplierSettings = () => {
  const [productForm] = Form.useForm();
  const { data, loading, error, refetch } = useQuery(GET_PRODUCTS, {
    fetchPolicy: "network-only",
    variables: {
      organizationId: orgId
    }
  });
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const [displayProductModal, setDisplayProductModal] = useState(false);
  const [isProductUpdateMode, setIsProductUpdateMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(undefined);
  const [displaySupplierPartDrawer, setDisplaySupplierPartDrawer] = useState(false);
  const toggleProductModal = () => {
    setDisplayProductModal(!displayProductModal);
  };

  const resetState = () => {
    toggleProductModal();
    setIsProductUpdateMode(false);
    setSelectedProduct(undefined);
  };

  const onFinish = async (values) => {
    const variables = { data: values };
    
    if (isProductUpdateMode) {
      variables.id = selectedProduct.id;
      await updateProduct({ variables })
        .then(() => {
          resetState();
          refetch();
        })
        .catch(error => { console.log(error) });
    } else {
      await createProduct({ variables })
        .then(() => {
          resetState();
          refetch();
        })
        .catch(error => { console.log(error) });
    }
  };

  const renderProductModal = () => {
    const products = !!selectedProduct && data?.getProducts?.filter(product => {
      return product.id !== selectedProduct.id
    });
    
    productForm.setFieldsValue(
      isProductUpdateMode ?
      selectedProduct : 
      {
        productFamily: '',
        productFamilyFriendlyName: '',
        successorId: undefined
      }
    );
    return (
      <Modal 
        footer={null} 
        title={isProductUpdateMode ? 'Update product' : "Add product"} 
        visible={displayProductModal} 
        onCancel={resetState}
      >
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
          form={productForm}
        >
          <Form.Item
            label="Product name"
            name="productFamily"
            rules={[
              {
                required: true,
                message: 'Please input product name',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Friendly name"
            name="productFamilyFriendlyName"
            rules={[
              {
                required: true,
                message: 'Please input product family name',
              },
            ]}
          >
            <Input />
          </Form.Item>
          {
            isProductUpdateMode && (
              <Form.Item
                label="Successor product"
                name="successorId"
              >
                <Select
                  placeholder="Select successor"
                  onChange={() => {}}
                >
                  {products.map((supplierProduct) => (
                    <Option key={supplierProduct.id} value={supplierProduct.id}>{supplierProduct.productFamilyFriendlyName}</Option>
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

  const ProductColumns = [
    {
      title: "#",
      dataIndex: "no",
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: "Produt Family",
      dataIndex: "productFamily",
      render: (text, record) => {
        return (
          <>
            <a onClick={() => {
              setDisplaySupplierPartDrawer(true);
              setSelectedProduct(record);
            }}>{text}</a>
          </>
        );
      },
    },
    {
      title: "Friendly name",
      dataIndex: "productFamilyFriendlyName",
      render: tableDataText,
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
                setIsProductUpdateMode(true);
                setSelectedProduct(record);
                toggleProductModal();
              }}
            />
          </>
        );
      },
    },
  ];

  const products = getProductsData(data?.getProducts);
  return (
    <>
      {displaySupplierPartDrawer && (
        <SupplierPartSettings
          supplierProduct={selectedProduct}
          onDrawerClose={() => {
            setSelectedProduct(undefined);
            setDisplaySupplierPartDrawer(false);
          }}
        />
      )}
      {renderProductModal()}
      <Button type="primary" onClick={toggleProductModal}>Add product</Button>
      {
        products.length > 0 && (
          <Table
            columns={ProductColumns}
            rowKey={(record) => record.key}
            expandable={{
              rowExpandable: () => false,
            }}
            dataSource={products}
            size="small"
            scroll={{ x: true }}
            pagination={false}
          />
        )
      }
    </>
  )
};

export default SupplierSettings;
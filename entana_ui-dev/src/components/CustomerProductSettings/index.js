import React, { useState } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import CustomerPartSettings from 'components/CustomerPartSettings';
import { GET_PRODUCT_BY_COMMODITY, GET_PRODUCTS, GET_COMMODITY_SUPPLIERS } from './graphql/query';
import { Table, Button, Form, Modal, Select } from 'antd';
import {
  tableDataText
} from 'utils/table';
import {
  useCreateCustomerProduct,
  useUpdateCustomerProduct
 } from './graphql/mutation';
 import openNotification from 'utils/Notification';
 import { 
  EditOutlined
} from '@ant-design/icons';

const { Option } = Select;

const getProductsData = (products, suppliers) => {
  if (!products) return [];
  const supplierMap = new Map();
  const supplierProductMap = new Map();
  suppliers?.map(supplier => {
    supplierMap.set(supplier.id, supplier.name);
    supplierProductMap.set(supplier.id, new Set());
  });

  const productsData = products.map(product => {
    // const supplier = product.supplierProduct.orgId;
    // const supplierProducts = supplierProductMap.get(supplier);
    // supplierProducts.add(product.supplierProduct.id);
    return {
      ...product,
      key: product.id,
      productFamily: product.supplierProduct.productFamily,
      productFamilyFriendlyName: product.supplierProduct.productFamilyFriendlyName,
      supplier: supplierMap.get(product.supplierProduct.orgId)
    }
  });
  
  return productsData;
};

const CustomerProductSettings = ({ commodityId }) => {
  const [customerProductForm] = Form.useForm();
  const [displayCustomerPartsDrawer, setDisplayCustomerPartsDrawer] = useState(false);
  const [displayCustomerProductModal, setDisplayCustomerProductModal] = useState(false);
  const [selectedCustomerProduct, setSelectedCustomerProduct] = useState(undefined);
  const [isCustomerProductUpdateMode, setIsCustomerProductUpdateMode] = useState(false);
  const createCustomerProduct = useCreateCustomerProduct();
  const updateCustomerProduct = useUpdateCustomerProduct();

  const [
    getSupplierProducts,
    { loading: productsLoading, error: productsError, data: productsData },
  ] = useLazyQuery(GET_PRODUCTS, { fetchPolicy: 'network-only' });

  const { data, refetch } = useQuery(GET_PRODUCT_BY_COMMODITY, {
    variables: { commodityId },
    fetchPolicy: 'network-only'
  });

  const queryInput = {
    where: {
      commodityIds: commodityId,
    },
  };

  const { loading: suppliersLoading, error: suppliersError, data: suppliersData }= useQuery(GET_COMMODITY_SUPPLIERS, {
    variables: queryInput,
    fetchPolicy: 'network-only'
  });

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
              setDisplayCustomerPartsDrawer(true);
              setSelectedCustomerProduct(record);
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
      title: "Supplier",
      dataIndex: "supplier",
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
                await getSupplierProducts({
                  variables: {
                    organizationId: record.supplierProduct.orgId
                  },
                });
                setIsCustomerProductUpdateMode(true);
                setSelectedCustomerProduct(record);
                setDisplayCustomerProductModal(true);
              }}
            />
          </>
        );
      },
    },
  ];

  const resetSelectedProduct = () => {
    setDisplayCustomerPartsDrawer(false);
    setSelectedCustomerProduct(undefined);
  };

  const resetCustomerModalState = () =>{
    setDisplayCustomerProductModal(false);
    setIsCustomerProductUpdateMode(false);
    setSelectedCustomerProduct(undefined);
  }

  const onSupplierChange = async (value) => {
    await getSupplierProducts({
      variables: {
        organizationId: value
      },
    });
  };

  const onAddCustomerProduct = async (values) => {
    const data = {
      supplierProductId: values.supplierProductId,
      commodityId
    };

    const variables = { data };

    if (isCustomerProductUpdateMode) {
      variables.data.successorId = values.successorId;
      variables.id = selectedCustomerProduct.id;
      await updateCustomerProduct({ variables })
        .then(({ data }) => {
          if (data) {
            openNotification('success', 'Relation update successfully');
            resetCustomerModalState();
            refetch();
          } else {
            openNotification('error', 'Error while updating relation');
          }
        })
        .catch((error) => {
          console.log(error)
          openNotification('error', 'Error while updating relation');
        });
    } else {
      await createCustomerProduct({ variables })
        .then(({ data }) => {
          if (data) {
            openNotification('success', 'Relation created successfully');
            resetCustomerModalState();
            refetch();
          } else {
            openNotification('error', 'Error while creating relation');
          }
        })
        .catch((error) => {
          console.log(error)
          openNotification('error', 'Error while creating relation');
        });
    }
  }

  const renderAddCustomerProductModal = () => {
    const successorOptions = !!selectedCustomerProduct && data?.getProductByCommodity?.filter(part => {
      return part.id !== selectedCustomerProduct.id;
    });

    customerProductForm.setFieldsValue(
      isCustomerProductUpdateMode ?
      {
        supplier: selectedCustomerProduct.supplierProduct.orgId,
        supplierProductId: selectedCustomerProduct.supplierProductId,
        successorId: selectedCustomerProduct.successorId
      } : 
      {
        supplier: undefined,
        supplierProductId: undefined,
        successorId: undefined
      }
    );

    const products = productsData?.getProducts?.filter(product => {
      return true;
    })
    
    return (
      <Modal 
        footer={null} 
        title={isCustomerProductUpdateMode ? 'Update customer product' : 'Add customer product'} 
        visible={displayCustomerProductModal} 
        onCancel={resetCustomerModalState}>
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          onFinish={onAddCustomerProduct}
          onFinishFailed={() => {}}
          autoComplete="off"
          form={customerProductForm}
        >
          <Form.Item
            label="Select supplier"
            name="supplier"
          >
            <Select
              placeholder="Select supplier"
              onChange={onSupplierChange}
              disabled={isCustomerProductUpdateMode}
            >
              {suppliersData?.getCommoditySuppliers[0].suppliers.map((supplier) => (
                <Option key={supplier.id} value={supplier.id}>{supplier.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Select product"
            name="supplierProductId"
          >
            <Select
              placeholder="Select product"
              onChange={() => {}}
              disabled={isCustomerProductUpdateMode}
            >
              {products?.map((product) => (
                <Option key={product.id} value={product.id}>{product.productFamilyFriendlyName}</Option>
              ))}
            </Select>
          </Form.Item>
          {
            isCustomerProductUpdateMode && (
              <Form.Item
                label="Successor product"
                name="successorId"
              >
                <Select
                  placeholder="Select successor"
                  onChange={() => {}}
                >
                  {successorOptions.map((option) => (
                    <Option key={option.id} value={option.id}>{option.supplierProduct.productFamilyFriendlyName}</Option>
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
            Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  const products = getProductsData(data?.getProductByCommodity, suppliersData?.getCommoditySuppliers[0]?.suppliers);
  return (
    <>
      <Button style={{ marginBottom: '10px' }} type="primary" onClick={() => setDisplayCustomerProductModal(true)}>Add product</Button>
      { 
        displayCustomerProductModal && (
          renderAddCustomerProductModal()
        )
      }
      {
        displayCustomerPartsDrawer && (
          <CustomerPartSettings 
            customerProduct={selectedCustomerProduct}
            onDrawerClose={resetSelectedProduct}
          />
        )
      }
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
  );
};

export default CustomerProductSettings;
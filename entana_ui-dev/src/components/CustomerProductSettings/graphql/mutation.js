import { gql, useMutation } from '@apollo/client';

const CREATE_CUSTOMER_PRODUCT = gql`
  mutation createCustomerProduct($data: CustomerProductCreateInput!) {
    createCustomerProduct(data: $data) {
      id
      supplierProductId
      commodityId
      successorId
      imageUrl
    }
  } 
`;

const UPDATE_CUSTOMER_PRODUCT = gql`
  mutation updateCustomerProduct($data: CustomerProductUpdateInput!, $id: ID!) {
    updateCustomerProduct(data: $data, id: $id) {
      id
      supplierProductId
      commodityId
      successorId
      imageUrl
    }
  } 
`;

export function useCreateCustomerProduct() {
  const [createCustomerProduct] = useMutation(CREATE_CUSTOMER_PRODUCT);
  return createCustomerProduct;
}

export function useUpdateCustomerProduct() {
  const [updateCustomerProduct] = useMutation(UPDATE_CUSTOMER_PRODUCT);
  return updateCustomerProduct;
}
import { gql, useMutation } from '@apollo/client';

const CREATE_PRODUCT = gql`
  mutation createProduct ($data: ProductCreateInput!) {
    createProduct(data: $data) {
      id
      orgId
      productFamily
      productFamilyFriendlyName
      successorId
    }
  }
`;

const UPDATE_PRODUCT = gql`
  mutation updateProduct ($data: ProductUpdateInput!, $id: ID!) {
    updateProduct(data: $data, id: $id) {
      id
      orgId
      productFamily
      productFamilyFriendlyName
      successorId
    }
  }
`;

export function useUpdateProduct() {
  const [updateProduct] = useMutation(UPDATE_PRODUCT);
  return updateProduct;
}

export function useCreateProduct() {
  const [createProduct] = useMutation(CREATE_PRODUCT);
  return createProduct;
}
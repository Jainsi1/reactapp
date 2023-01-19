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

export const ADD_QBR_SCORE = gql`
  mutation addQbrScore ($data: QbrScoreCreateOrUpdateInput!) {
    createQbrScore(data: $data) {
      id
    }
  },
`

export const UPDATE_QBR_SCORE = gql`
  mutation updateQbrScore ($data: QbrScoreCreateOrUpdateInput!, $where: QbrScoreWhereInput) {
    updateQbrScore(data: $data, where: $where) {
      id
    }
  },
`

export const REMOVE_QBR_SCORE = gql`
  mutation removeQbrScore ($data: GetQbrScoreInput!) {
    deleteQbrScore(data: $data) {
      id
    }
  },
`

export const FREEZE_QBR_SCORE = gql`
  mutation freezeQbrScore ($data: GetQbrScoreInput!) {
    freezeQbrScore(data: $data) {
      hasError
    }
  },
`
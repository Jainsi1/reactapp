import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
  query getProducts($organizationId: ID!) {
    getProducts(organizationId: $organizationId) {
      id
      orgId
      productFamily
      productFamilyFriendlyName
      successorId
    }
  }
`;
import { gql } from '@apollo/client';

export const GET_CUSTOMER_PART_BY_PRODUCT = gql`
  query getCustomerPartByProduct($customerProductId: ID!) {
    getCustomerPartByProduct(customerProductId: $customerProductId) {
      id
      customerProductId
      supplierPartId
      partName
      successorId
      isActive
    }
  }
`;

export const GET_SUPPLIER_PARTS = gql`
  query getSupplierParts($productId: ID!) {
    getSupplierParts(productId: $productId) {
      id
      orgId
      productId
      partName
      successorId
    }
  }
`;

export const GET_CUSTOMER_PART_ROADMAP = gql`
  query getCustomerPartRoadmap($customerPartId: ID!) {
    getCustomerPartRoadmap(customerPartId: $customerPartId) {
      id
      customerPartId
      es1Date
      es2Date
      es3Date
      qualStartDate
      milestone1Date
      milestone2Date
      milestone3Date
      milestone4Date
      qualFinishDate
      rts
      rtm
      ltb
      lts
      standardLeadTime
      currentLeadTime
      needsUserAttention
      isPor
    }
  }
`;
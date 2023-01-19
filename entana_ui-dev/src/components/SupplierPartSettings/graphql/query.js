import { gql } from '@apollo/client';

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

export const GET_SUPPLIER_PART_ROADMAP = gql`
  query getSupplierPartRoadmap($supplierPartId: ID!) {
    getSupplierPartRoadmap(supplierPartId: $supplierPartId) {
      id
      supplierPartId
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
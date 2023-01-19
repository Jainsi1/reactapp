import { gql } from '@apollo/client';

export const GET_PRODUCT_BY_COMMODITY = gql`
  query getProductByCommodity($commodityId: ID!) {
    getProductByCommodity(commodityId: $commodityId) {
      id
      supplierProductId
      supplierProduct {
        id
        orgId
        productFamily
        productFamilyFriendlyName
        successorId
      }
      commodityId
      successorId
      isActive
      imageUrl
    }
  }
`;

export const GET_PRODUCTS = gql`
  query getProducts($organizationId: ID!) {
    getProducts(organizationId: $organizationId) {
      id
      orgId
      productFamily
      productFamilyFriendlyName
      successorId
      imageUrl
    }
  }
`;

export const GET_COMMODITY_SUPPLIERS = gql`
  query($where: GetCommoditySuppliersInput!) {
    getCommoditySuppliers(where: $where) {
      commodityId
      suppliers {
        id
        name
      }
    }
  }
`;
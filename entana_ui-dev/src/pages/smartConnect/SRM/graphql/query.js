import { gql } from '@apollo/client';

export const GET_ORGANIZATIONS = gql`
  query getOrganizations {
    getOrganizations{
      count
      organizations{
      id
      name
      address1
      organizationType{
        id
        name
      }
    }
    }
  }
`;

export const GET_ORGANIZATION_RELATION = gql`
  query GetOrganizationRelation($where: GetOrganizationRelationInput) {
    getOrganizationRelation(where: $where) {
      name
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

export const GET_INITIATIVE_BY_COMMODITY_AND_ORGANIZATION = gql`
  query getInitiativeByCommodityAndOrganization($where: GetInitiativeByCommodityAndOrganizationInput!) {
    getInitiativeByCommodityAndOrganization(where: $where) {
      id
      title
      businessObjective
      expectedBenefit
      plan
      current
      ownerId
      status
      type
    }
  }
`;

export const GET_INITIATIVES_BY_COMMODITY = gql`
  query getInitiativesByCommodity($commodityIds: [ID]!) {
    getInitiativesByCommodity(commodityIds: $commodityIds) {
      id
      relatedOrgId
      commodityId
      title
      businessObjective
      expectedBenefit
      plan
      current
      ownerId
      status
      type
      numTasks
    }
  }
`;

export const GET_EOL_RISK_ITEMS = gql`
  query getEOLRiskItems($commodityIds: [ID]!) {
    getEOLRiskItems(commodityIds: $commodityIds) {
      relatedOrgId
      product
      ltb
      lts
      successor
      successorGa
      isPor
      commodityId
    }
  }
`;

export const GET_COMMODITIES = gql`
  query($where: UserWhereUniqueInput!) {
    getCommodities(where: $where) {
      id
      name
    }
  }
`;
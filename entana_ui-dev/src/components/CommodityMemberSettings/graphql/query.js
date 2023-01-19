import { gql } from '@apollo/client';

export const GET_USERS_WITH_COMMODITY_ACCESS = gql`
  query getUsersWithCommodityAccess($commodityId: ID!, $organizationId: ID) {
    getUsersWithCommodityAccess(commodityId: $commodityId, organizationId: $organizationId) {
      id
      firstName
      lastName
      email
      role
      organization {
        id
        name
      }
    }
  }
`;

export const GET_GROUP_MEMBERS = gql`
  query($groupId: ID!) {
    getGroupMembers(groupId: $groupId) {
      id
      firstName
      lastName
      email
      role
      organization {
        id
        name
      }
    }
  }
`;
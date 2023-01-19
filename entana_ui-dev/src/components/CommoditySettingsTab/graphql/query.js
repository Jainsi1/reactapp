import { gql } from '@apollo/client';

export const GET_GROUP_COMMODITIES = gql`
  query($groupId: ID!) {
    getGroupCommodities(groupId: $groupId) {
      id
      name
    }
  }
`;
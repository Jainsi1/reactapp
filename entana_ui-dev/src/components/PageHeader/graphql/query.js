import { gql } from '@apollo/client';

export const GET_COMMODITIES = gql`
  query($where: UserWhereUniqueInput!) {
    getCommodities(where: $where) {
      id
      name
    }
  }
`;
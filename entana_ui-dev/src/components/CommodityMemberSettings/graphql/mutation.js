import { gql, useMutation } from '@apollo/client';

const ASSIGN_COMMODITY_TO_USER = gql`
  mutation assignCommodity ($input: AssignCommodityInput!) {
    assignCommodity(input: $input) {
      id
      userId
      commodityId
    }
  }
`;

export function useAssignCommodityToUser() {
  const [assignCommodity] = useMutation(ASSIGN_COMMODITY_TO_USER);
  return assignCommodity;
}
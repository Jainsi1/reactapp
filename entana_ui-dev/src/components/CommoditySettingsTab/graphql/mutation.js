import { gql, useMutation } from '@apollo/client';

const CREATE_COMMODITY = gql`
  mutation createCommodity ($data: CreateCommodityInput!) {
    createCommodity(data: $data) {
      id
      groupId
      name
    }
  }
`;

export function useCreateCommodity() {
  const [createCommodity] = useMutation(CREATE_COMMODITY);
  return createCommodity;
}
import { gql, useMutation } from '@apollo/client';

const UPDATE_ORDER = gql`
  mutation updateOrder ($id: ID!, $data: OrderUpdateInput!) {
    updateOrder(id: $id, data: $data) {
      id
    }
  }
`;

export function useUpdateOrder() {
  const [updateOrder] = useMutation(UPDATE_ORDER);
  return updateOrder;
}
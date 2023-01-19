import { gql, useMutation } from '@apollo/client';

const CREATE_GROUP = gql`
  mutation createGroup($data: CreateGroupInput!) {
    createGroup(data: $data) {
      id
      name
    }
  }
`;

export function useCreateGroup() {
  const [createGroup] = useMutation(CREATE_GROUP);
  return createGroup;
}
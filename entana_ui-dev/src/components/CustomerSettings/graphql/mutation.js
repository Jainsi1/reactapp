import { gql, useMutation } from '@apollo/client';

const ADD_GROUP_MEMBER = gql`
  mutation addGroupMember ($data: AddGroupMemberInput!) {
    addGroupMember(data: $data) {
      userId
      groupId
    }
  }
`;

export function useAddGroupMember() {
  const [addGroupMember] = useMutation(ADD_GROUP_MEMBER);
  return addGroupMember;
}
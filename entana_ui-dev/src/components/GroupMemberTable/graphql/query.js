import { gql } from '@apollo/client';

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
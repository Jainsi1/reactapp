import {gql} from '@apollo/client';

export const GET_CURRENT_USER = gql`
  query {
    currentUser {
      id
      email
      firstName
      lastName
      role
      organizationId
      image
      groups {
        id
        name
      }
      organization {
        name
      }
    }
  }
`;

import { gql } from '@apollo/client'

export const GET_PROFILE = gql`
  query getProfile ($where: GetProfileInput) {
    getProfile(where: $where) {
      firstName
      lastName
      name
      image
      industry
      location
      designation
      role
      organization
      memberShips {
        name type
      }
      permissions {
        name
        image
        industry
        location
        designation
        role
        organization
      }
      isCurrent
      isFollow
    }
  }
`;
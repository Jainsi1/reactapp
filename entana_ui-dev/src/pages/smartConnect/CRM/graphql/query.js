import { gql } from '@apollo/client'

export const GET_INITIATIVES = gql`
  query getInitiatives {
    getInitiatives {
      id
      relatedOrgId
      commodityId
      title
      businessObjective
      expectedBenefit
      plan
      current
      ownerId
      status
      type
      numTasks
      commodity {
        id
        name
      }
      relatedOrganization {
        id
        name
      }
    }
  }
`;

export const GET_BUYERS = gql`
query getBuyers {
  getBuyers {
    id
    name
    commodities {
      id
      name
    }
  }
}
`;
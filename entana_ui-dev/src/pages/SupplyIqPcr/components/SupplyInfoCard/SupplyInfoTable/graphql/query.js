import { gql } from '@apollo/client';

export const GET_AUDIT_TRAIL = gql`
  query getAuditTrail($id: ID!) {
    getAuditTrail(id: $id) {
      id
      orderId
      userId
      action
      field
      oldValue
      newValue
      createdAt
      updatedAt
      user {
        id
        firstName
        lastName
      }
    }
  }
`;
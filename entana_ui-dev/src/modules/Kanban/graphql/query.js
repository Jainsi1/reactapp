import { gql } from "@apollo/client";

export const GET_TASKS = gql`
  query getTasks {
    getTasks {
      count
      tasks {
        Id: id
        name
        status
        priority
        commodityId
        createdAt
        dueDate
        moduleType
        assignedUserId
        ownerUserId
        initiativeId
      }
    }
  }
`;

export const GET_TASKS_BY_INITIATIVE = gql`
  query getTasksByInitiative($initiativeId: ID!) {
    getTasksByInitiative(initiativeId: $initiativeId) {
      Id: id
      name
      status
      priority
      commodityId
      createdAt
      dueDate
      moduleType
      assignedUserId
      ownerUserId
      initiativeId
      ownerUser {
        firstName
        lastName
      }
      assignedUser {
        firstName
        lastName
      }
    }
  }
`;

export const GET_USER = gql`
  query currentUser {
    user {
      Id: id
      firstName
      lastName
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query getUser($where: UserWhereUniqueInput) {
    getUser(where: $where) {
      id
      firstName
      lastName
      email
    }
  }
`;

export const GET_USERS_WITH_COMMODITY_ACCESS = gql`
  query getUsersWithCommodityAccess($commodityId: ID!, $organizationId: ID) {
    getUsersWithCommodityAccess(commodityId: $commodityId, organizationId: $organizationId) {
      Id: id
      firstName
      lastName
    }
  }
`;

// export const GET_ASSIGNED_TASKS = gql`
//   query($where: UserWhereUniqueInput!) {
//     getAssignedTasks(where: $where) {
//       Id: id
//       name
//       status
//       priority
//       commodityId
//       createdAt
//       dueDate
//       moduleType
//       assignedUserId
//     }
//   }
// `;

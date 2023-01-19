import { gql } from '@apollo/client';

export const GET_ROOMS = gql`
  query GET_ROOMS {
    getRooms {
      id
      firstName
      lastName
      image
      latestMessage
      latestMessageRead
      senderId
      lastMessageAt
      isUserOnline
      designation
      organizationName
      personalNote 
    }
  }
`;

export const GET_MESSAGES = gql`
  query GET_MESSAGES($roomId: ID!) {
    getMessages(roomId: $roomId) {
      id
      userId
      senderId
      message
      deliveredAt
      seenAt
      createdAt
      updatedAt
    }
  }
`;

export const GET_USERS = gql`
  query GET_USERS($where: UserWhereInput,$skip:Int,$limit:Int){
    getUsers(where:$where,skip: $skip,limit: $limit){
      users {
        id
        firstName
        lastName
        image
      }
      count
    }
  }
`

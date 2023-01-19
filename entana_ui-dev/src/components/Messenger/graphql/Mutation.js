import { gql } from '@apollo/client'

export const CREATE_ROOM = gql`
  mutation createRoom ($user_id: ID!) {
    createRoom(user_id: $user_id) {
      id
      firstName
      lastName
      image
      latestMessage
      latestMessageRead
      senderId
      lastMessageAt
    }
  },
`

export const UPDATE_PERSONAL_NOTE = gql`
  mutation updatePersonalNote ($data: UpdatePersonalNoteInput!) {
    updatePersonalNote(data: $data) {
      message
    }
  },
`
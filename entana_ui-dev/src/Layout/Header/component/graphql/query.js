import { gql } from '@apollo/client'

export const GET_UNSEEN_NOTIFICATIONS = gql`
    query getUnseenNotifications {
        getUnseenNotifications {
            id
            name
            content
            type
            triggeredUser {
                firstName
            }
            isNotified
            brief
        }
    }
`;
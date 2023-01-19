import { gql } from '@apollo/client'


export const BATCH_QUERY_NOTIFICATION = gql`
    query getBatchNotifications($data: NotificationBatchGetInput!) {
        getBatchNotifications(data: $data) {
            notifications {
                id
                content
                type
                triggeredUser {
                    firstName
                }
                isNotified
                publishedAt
            }
            offset
        }
    }
`;

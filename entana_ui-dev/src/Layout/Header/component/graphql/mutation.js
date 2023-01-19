import { gql, useMutation } from '@apollo/client';

const VIEW_NOTIFICATION = gql`
mutation viewedAllNotifications {
    viewedAllNotifications {
        status
    }
}
`;


export function useViewedNotification() {
    const [viewNotification] = useMutation(VIEW_NOTIFICATION);
    return viewNotification;
}
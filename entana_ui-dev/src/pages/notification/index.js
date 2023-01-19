import React, { useEffect } from 'react';
import WithRequestData from 'components/RequestWrapper';
import { BATCH_QUERY_NOTIFICATION } from './graphql/query';
import style from './style.module.css'
import { NavLink } from 'react-router-dom';
import { useState } from 'react';

export default function NotificationPageWrapper() {
    const variables = {
        data: {
            limit: 30,
            offset: 0,

        }
    }

    return (
        <WithRequestData query={BATCH_QUERY_NOTIFICATION} variables={variables}>
            {
                ({ data }) => <NotificationPage data={data} />
            }
        </WithRequestData >
    )
}


const NotificationItem = (props) => {
    const { content } = props;

    return (
        <div className={style.notification_item}>
            <NavLink to='/task' >
                {content}
            </NavLink>
        </div>
    )
}

const NotificationByDay = (props) => {
    const { notifications, day } = props;

    return (
        <div className='mb-4'>
            <h3 style={{ 'textAlign': 'left' }}><emp>{day}</emp> </h3>
            {
                notifications.map((props, idx) => <NotificationItem {...props} />)
            }
        </div>
    )

}

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function formatDate(stringDate) {
    const date = new Date(stringDate)

    return [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
    ].join('-');
}

function getToday () {
    return formatDate(Date.now())
}

function getYesterday(params) {
    return formatDate(Date.now()-24*60*60*1000)
}

const NotificationPage = (props) => {
    const { data: queryResult } = props;

    // const [offset, setOffset] = useState[0];
    const notifications = queryResult.getBatchNotifications.notifications;


    const notification_by_date = {}

    for (const notification of notifications) {
        let day = formatDate(notification.publishedAt) 

        if (day === getToday()) {
            day = 'Today'
        } else if (day == getYesterday()) {
            day = 'Yesterday'
        }

        if (day in notification_by_date) {
            notification_by_date[day].push(notification)
        } else {
            notification_by_date[day] = [notification]
        }
    }

    return (

        <div className={style.container}>
            <h2>Notifications</h2>
            <div className={style.notification_board}>
                {
                    notifications.length > 0 ?
                        Object.entries(notification_by_date).map(([day, notifications]) => <NotificationByDay day={day} key={day} notifications={notifications} />) :
                        <p> No Notifications</p>
                }
            </div>
        </div>
    )
}


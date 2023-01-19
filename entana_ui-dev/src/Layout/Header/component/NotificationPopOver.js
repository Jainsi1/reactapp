import {
  Popover,
  Row,
  Col,
  Badge, notification
} from "antd"
import {
  BellOutlined
} from "@ant-design/icons"

import React, { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";

// import { useQuery } from "@apollo/client"
// import { GET_UNSEEN_NOTIFICATIONS } from "./graphql/query"

//import style from './style/notifications.module.css'
import {
  useViewedNotification
} from './graphql/mutation'

import message from "assets/images/message.svg"
import { SocketContext } from "../../../context/socket";

// const useNotification = () => {
//   const [notification, setNotification] = useState([]);
//
//
//   const {
//     data, loading, error, refetch
//   } = useQuery(GET_UNSEEN_NOTIFICATIONS, {
//     pollInterval: 30 * 1000
//   })
//
//   useEffect(() => {
//     console.log(data)
//     data && setNotification(data.getUnseenNotifications);
//   }, [data])
//
//
//   return [notification, refetch]
// }

const openNotification = (title, content) => {
  notification.open({
    message: title,
    description: content
  });
};

const RowNotification = (props) => {
  const { brief } = props

  return (
    <Row style={{ 'paddingBottom': "1em" }}>
      <Col span={4}>
        <div
          style={{
            background: "#3286ff",
            padding: "8px",
            borderRadius: "50%",
            height: "40px",
            width: "40px",
            textAlign: "center",
          }}
        >
          <img src={message} alt="message"/>
        </div>
      </Col>
      <Col span={20}
           style={{
             'overflow-wrap': 'break-word'
           }}>
        {brief} <NavLink to="/task">{' '} Click here to see more</NavLink></Col>
    </Row>
  )
}

const NotificationPopContent = (props) => {
  const { data } = props;

  return (
    <div style={{ width: 300 }}>
      {
        data.length > 0 ?
          data.map((props, idx) => <RowNotification {...props} key={idx}/>) :
          <p style={{ 'textAlign': 'center' }}> Currently there is no new notifications. </p>
      }
      <div style={{
        'text-align': 'center',
        'padding-top': '1em',
        'border-top': 'solid 2px rgba(43, 42, 42, 0.158)'

      }}>
        <NavLink to="/notifications">View All Notifications</NavLink>
      </div>
    </div>
  )
}

export default function NotificationPopOver() {
  const socket = useContext(SocketContext);

  const [notification, setNotification] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    socket.on('notification', obj => {
      setNotification(data => {
        data.unshift({
          brief: obj.content
        })
        return data
      })
      openNotification(obj.title, obj.content)
      refreshNow()
    })

    return () => {
      socket.off('notification');
    };
  }, []);

  const refreshNow = () => {
    setRefresh(() => {
      return true
    })
    setRefresh(() => {
      return false
    })
  }

  const viewNotification = useViewedNotification()

  const onClick = () => {
    if ( !notification.length) {
      return
    }
    setTimeout(() => {
      viewNotification()
        .then(() => {
          setNotification(() => {
            return []
          })
          refreshNow()
        })
    }, 5 * 1000)
  }

  return (
    !refresh ?
      <Popover
        overlayClassName="notification-popup"
        placement="bottomRight"
        content={<NotificationPopContent data={notification}/>}
        trigger="click"
        onClick={() => onClick(notification.length)}
      >
        <Badge count={notification.length} className="badge-icon">
          <BellOutlined className="bell-icon"/>
        </Badge>
      </Popover> : null
  )
}
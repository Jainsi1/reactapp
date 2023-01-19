import { notification } from 'antd'

export default function openNotification(type, message, description) {
  notification[type]({
    duration: 2.5,
    message,
    description
  })
}

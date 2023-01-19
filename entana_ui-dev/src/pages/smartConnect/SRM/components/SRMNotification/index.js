import React from 'react'
import { Row, Col } from 'antd'
import message from 'assets/images/message.svg'
import './srmNotification.css'
import Widget from 'components/Widget';

function SRMNotification() {
  return (
    <Widget>
      <div style={{ width: 300 }}>
        <Row>
          <Col span={4}>
            <div className='message-icon'>
              <img src={message} alt="message" />
            </div>
          </Col>
          <Col span={20}>
            <span>
              FQ4’21 QBR Scoring due in 1 week. Click to complete supplier
              scoring.
            </span>
          </Col>
        </Row>
      </div>
    </Widget>
  )
}

export default SRMNotification

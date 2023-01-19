import React from 'react'
import { Card } from 'antd';
import './widget.css'

const widget = ({ children, className = '', style = null }) => {
  return (
    <Card className={`widget-card ${className}`} style={style}>
      {children}
    </Card>
  )
}
export default widget

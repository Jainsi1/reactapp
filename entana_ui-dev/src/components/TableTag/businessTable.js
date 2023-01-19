import React from 'react';
import './tableTag.css';
import { Tag } from 'antd';


export default function businessTable(text, record) {

  return (
    <div>
      <Tag color={record.changeBusiness ? 'error' : 'success'} className='true-tag'>{text}</Tag>
    </div>
  )
}

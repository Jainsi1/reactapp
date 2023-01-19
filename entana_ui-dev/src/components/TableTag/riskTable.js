import React from 'react';
import './tableTag.css';
import { Tag } from 'antd';


export default function riskTable(text) {

  return (
    <div>
      <Tag color={text ? 'error' : 'success'} className='true-tag'>{text ? 'Yes' : 'No'}</Tag>
    </div>
  )
}

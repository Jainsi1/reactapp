import React from 'react';
import { Col } from 'antd';

import SupplyPcrWidget from './SupplyPCRWidget';
import TasksWidget from './TaskWidget';

const DashboardWidget = (props) => {
  const { selectedCommodity } = props;

  return (
    <>
      <Col md={4} xl={6}>
        <sider style={{overflow: 'auto', position: 'sticky',left: 0, top: 82, bottom: 0,}}>
          {selectedCommodity.length &&  <SupplyPcrWidget selectedCommodity={selectedCommodity} />}
        </sider>
      </Col>
      <Col md={4} xl={6}>
        <sider style={{overflow: 'auto', position: 'sticky',left: 0, top: 82, bottom: 0,}}>
          {selectedCommodity.length && <TasksWidget selectedCommodity={selectedCommodity} />}
        </sider>
      </Col>
    </>
  )
};

export default DashboardWidget;
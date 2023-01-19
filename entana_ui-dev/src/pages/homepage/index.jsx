import React, { useState } from 'react';
import { Row, Col } from 'antd';

import PageHeader from 'components/PageHeader';
import NewsFeed from 'components/NewsFeed/NewsFeed';
import DashboardWidgets from './components/DashboardWidgets';

import './dashboard.css';

export default function HomePage ()  {
  const [selectedCommodity, setSelectedCommodities] = useState([]);
  return (
    <>
      <PageHeader 
        setSelectedCommodities={setSelectedCommodities}
        title="Home"
      />
      <Row gutter={16}>
        <Col xs={24} md={16} xl={12}>
          {/*PostWall*/}
          <NewsFeed/>
        </Col>
        <DashboardWidgets selectedCommodity={selectedCommodity} />
      </Row>
    </>
  )
}


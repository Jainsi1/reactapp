import React from 'react';
import { Tabs } from 'antd';
import CustomerProductSettings from 'components/CustomerProductSettings';
import CommodityMemberSettings from 'components/CommodityMemberSettings';
import { useParams } from "react-router-dom";

import './commoditySettings.css';

const { TabPane } = Tabs;

const CommoditySettings = () => {
  const { id } = useParams();

  return (
    <div className="card-container">
      <Tabs type="card">
        <TabPane tab="Commodity members" key="1">
          <CommodityMemberSettings commodityId={id} />
        </TabPane>
        <TabPane tab="Customer products" key="2">
          <CustomerProductSettings commodityId={id} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default CommoditySettings;
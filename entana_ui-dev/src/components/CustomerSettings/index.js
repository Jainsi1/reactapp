import React, { useState } from 'react';
import { Tabs, Input, Button } from 'antd';
import { getCurrentGroup } from 'utils/user';
import { useAddGroupMember } from './graphql/mutation';
import openNotification from 'utils/Notification';
import GroupMemberTable from 'components/GroupMemberTable';
import QBRTemplateContainer from '../QBRTemplates';
import CommoditySettingsTab from '../CommoditySettingsTab';

import './customersettings.css';


const { TabPane } = Tabs;

const group = getCurrentGroup();

const CustomerSettings = () => {
  const [memberEmail, setMemberEmail] = useState('');
  const addGroupMember = useAddGroupMember();

  const onAddGroupMember = async () => {
    const data = {
      email: memberEmail,
      groupId: group.id
    };
    const variables = { data };
    await addGroupMember({ variables })
      .then(({ data }) => {
        if (data) {
          openNotification('success', 'Member added successfully');
        } else {
          openNotification('error', 'Error while adding member');
        }
      })
      .catch((error) => {
        console.log(error)
        openNotification('error', 'Error while adding member');
      });
  }

  const renderGroupTab = () => {
    return (
      <>
        <h2>{group.name}</h2>
        <Input.Group compact>
          <Input
            style={{
              width: '300px',
            }}
            placeholder="example@entana.net"
            onChange={(event) => setMemberEmail(event.target.value)}
          />
          <Button disabled={!memberEmail || memberEmail === ''} type="primary" onClick={onAddGroupMember}>Add member</Button>
        </Input.Group>
        <GroupMemberTable group={group} />
      </>
    );
  };

  return (
    <div className="card-container">
      <Tabs type="card">
        <TabPane tab="QBR Templates" key="3">
          <QBRTemplateContainer />
        </TabPane>
        <TabPane tab="Group" key="1">
          {renderGroupTab()}
        </TabPane>
        <TabPane tab="Commodities" key="2">
          <CommoditySettingsTab />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default CustomerSettings;

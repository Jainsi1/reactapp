import React, { useState } from 'react';
import { Input, Button, List } from 'antd';
import { getGroups, getUserRole } from 'utils/user';
import history from 'utils/CustomHistory';
import { useCreateGroup } from './graphql/mutation';
import openNotification from 'utils/Notification';

const GroupSeletor = () => {
  const [groupName, setGroupName] = useState('');
  const createGroup = useCreateGroup();

  const onGroupSelected = (group) => {
    localStorage.setItem('currentGroup', JSON.stringify(group));
    history.push('/', { replace: true });
    window.location.reload(true);
  };

  const onCreateNewGroup = async () => {
    const data = {
      name: groupName,
    };
    const variables = { data };
    await createGroup({ variables })
        .then(({ data }) => {
          if (data) {
            console.log(data)
            openNotification('success', 'Group created successfully');
            onGroupSelected(data.createGroup);
          } else {
            openNotification('error', 'Error while creating group');
          }
        })
        .catch((error) => {
          console.log(error)
          openNotification('error', 'Error while creating group');
        });
  };

  const groups = getGroups();
  const isUserCommodityManager = getUserRole() === 'commodity manager';
  return (
    <div style={{ padding: 20 }}>
      {isUserCommodityManager && (
        <>
          <h2>Create new group</h2>
          <Input.Group compact>
            <Input
              style={{
                width: '300px',
              }}
              placeholder="group name"
              onChange={(event) => setGroupName(event.target.value)}
            />
            <Button disabled={!groupName || groupName === ''} type="primary" onClick={onCreateNewGroup}>Create group</Button>
          </Input.Group>
        </>
      )}
      {groups.length > 0 && (
        <div>
          <span>Please select a group</span>
          <List
            size="small"
            dataSource={groups}
            renderItem={(item) => <List.Item><a onClick={() => onGroupSelected(item)}>{item.name}</a></List.Item>}
          />
        </div>
      )}
      
    </div>
  );
};
export default GroupSeletor;
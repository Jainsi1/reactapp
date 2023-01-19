import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USERS_WITH_COMMODITY_ACCESS, GET_GROUP_MEMBERS } from './graphql/query';
import { Button, Modal, Select, Table } from 'antd';
import {
  tableDataText
} from 'utils/table';
import { getCurrentGroup } from 'utils/user';
import { 
  useAssignCommodityToUser
 } from './graphql/mutation';
 import openNotification from 'utils/Notification';

const { Option } = Select;

const MemberColumns = [
  {
    title: "#",
    dataIndex: "no",
    render: (text, record, index) => `${index + 1}`,
  },
  {
    title: "Name",
    dataIndex: "name",
    render: tableDataText,
  },
  {
    title: "Organization",
    dataIndex: "organization",
    render: tableDataText,
  }
];

const getMembersData = (members) => {
  if(!members) return [];

  return members.map(member => {
    return {
      ...member,
      key: member.id,
      name: member.firstName + " " + member.lastName,
      organization: member?.organization?.name
    }
  })
};
const group = getCurrentGroup();

const CommodityMemberSettings = ({ commodityId }) => {
  const [displayAddMemberModal, setDisplayAddMemberModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(undefined);
  const assignCommodity = useAssignCommodityToUser();
  const { data, loading, error, refetch: refetchCommodityMembers } = useQuery(GET_USERS_WITH_COMMODITY_ACCESS, {
    variables: { commodityId: commodityId },
    fetchPolicy: 'network-only'
  });

  const { data: groupMembersData, loading: groupMembersLoading, error: groupMembersError } = useQuery(GET_GROUP_MEMBERS, {
    variables: { groupId: group.id },
    fetchPolicy: 'network-only'
  });

  const members = getMembersData(data?.getUsersWithCommodityAccess);

  const handleCancel = () => {
    setDisplayAddMemberModal(false);
    setSelectedMember(undefined);
  };

  const onMemberChange = (value) => {
    setSelectedMember(value);
  };

  const onAssignCommodity = async () => {
    const input = {
      userId: selectedMember,
      commodityId
    };

    const variables = { input };
    await assignCommodity({ variables })
        .then(({ data }) => {
          if (data) {
            openNotification('success', 'Assigned commodity successfully');
            handleCancel();
            refetchCommodityMembers();
          } else {
            openNotification('error', 'Error while assigning commodity');
          }
        })
        .catch((error) => {
          console.log(error)
          openNotification('error', 'Error while assigning commodity');
        });
  }

  const renderAddMemberModal = () => {
    const assignedMembersSet = new Set();
    members.forEach(member => {
      assignedMembersSet.add(member.id);
    });

    const unassignedMembers = groupMembersData?.getGroupMembers?.filter(groupMember => {
      return !assignedMembersSet.has(groupMember.id)
    });
    
    return (
      <Modal footer={null} title={'Add member'} visible={displayAddMemberModal} onCancel={handleCancel}>
        <Select
          placeholder="Select member"
          onChange={onMemberChange}
        >
          {unassignedMembers.map((member) => (
            <Option key={member.id} value={member.id}>{member.firstName} {member.lastName}</Option>
          ))}
        </Select>
        <Button disabled={!selectedMember} type="primary" onClick={onAssignCommodity}>Assign commodity</Button>
      </Modal>
    );
  };

  return (
    <>
      <Button 
        type="primary"
        style={{ marginBottom: '10px' }}
        onClick={() => setDisplayAddMemberModal(true)}>
          Add member
      </Button>
      { displayAddMemberModal && (
        renderAddMemberModal()
      )}
      {
        members.length > 0 && (
          <Table
            columns={MemberColumns}
            rowKey={(record) => record.key}
            expandable={{
              rowExpandable: () => false,
            }}
            dataSource={members}
            size="small"
            scroll={{ x: true }}
            pagination={false}
          />
        )
      }
    </>
  )
};

export default CommodityMemberSettings;
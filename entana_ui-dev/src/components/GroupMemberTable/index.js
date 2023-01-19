import React from 'react';
import { useQuery } from '@apollo/client';
import TableCard from 'components/TableCard/index';
import {
  tableDataText
} from 'utils/table';
import { GET_GROUP_MEMBERS } from './graphql/query';

const groupMemberColumns = [
  {
    title: "First name",
    dataIndex: "firstName",
    render: tableDataText,
  },
  {
    title: "Last name",
    dataIndex: "lastName",
    render: tableDataText,
  },
  {
    title: "Email",
    dataIndex: "email",
    render: tableDataText,
  },
  {
    title: "Organization",
    dataIndex: "organization",
    render: tableDataText,
  },
  {
    title: "Role",
    dataIndex: "role",
    render: tableDataText,
  }
];

const getTableData = (data) => {
  const tableData = data?.map(d => {
    return {
      firstName: d.firstName,
      lastName: d.lastName,
      role: d.role,
      email: d.email,
      organization: d.organization.name
    }
  });
  return tableData;
};

const GroupMemberTable = ({ group }) => {
  const { data: groupMembersData, loading: groupMembersLoading, error: groupMembersError } = useQuery(GET_GROUP_MEMBERS, {
    variables: { groupId: group.id },
    fetchPolicy: 'network-only'
  });

  return (
    <div className="table-main-card">
      <TableCard
        title="Group members"
        data={getTableData(groupMembersData?.getGroupMembers)}
        columns={groupMemberColumns}
      />
    </div>
  );
};

export default GroupMemberTable;
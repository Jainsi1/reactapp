import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_TASKS_BY_INITIATIVE } from 'modules/Kanban/graphql/query';
import {
  tableDataText
} from 'utils/table';
import TableCard from 'components/TableCard';
import { 
  PlusOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { Button, Modal } from 'antd';
import KanbanDialogFormTemplate from '../../components/KanbanDialogTemplate';
import {
  useCreateTask,
  useUpdateTask,
  useDeleteTask
} from 'modules/Kanban/graphql/mutation';

import './initiativeExpandedRow.css';

const getFormattedTasks = (tasks) => {
  return tasks?.map((task) => {
    return { 
      ...task,
      dueDate: task.dueDate ? task.dueDate.split("T")[0]: null
    }
  });
};

const InitiativeExpandedRow = ({ 
  initiativeId,
  selectedCommodity,
  relatedOrg 
}) => {
  const [displayTaskModal, setDisplayTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(undefined);
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const resetTaskState = () => {
    setDisplayTaskModal(false);
    setSelectedTask(undefined);
  };

  const { data, refetch } = useQuery(GET_TASKS_BY_INITIATIVE, {
    variables: { initiativeId },
    fetchPolicy: "network-only"
  });

  const onDeleteRecord = (record) => {
    Modal.confirm({
      title: "Are you sure you want to delete this task?",
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: async () => {
        const variables = { where: { id: record.Id } };
        await deleteTask({ variables })
          .then(async () => {
            await refetch();
          })
          .catch();
      },
    });
  };

  const groupMemberColumns = [
    {
      title: "Name",
      dataIndex: "name",
      render: tableDataText,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: tableDataText,
    },
    {
      title: "Priority",
      dataIndex: "priority",
      render: tableDataText,
    },
    {
      title: "Due date",
      dataIndex: "dueDate",
      render: tableDataText,
    },
    {
      title: "Owner",
      dataIndex: "owner",
      render: tableDataText,
    },
    {
      title: "Assignee",
      dataIndex: "assignee",
      render: tableDataText,
    },
    {
      title: "ACTIONS",
      dataIndex: "actions",
      render: (text, record) => {
        return (
          <>
            <EditOutlined
              style={{ marginLeft: 12 }}
              onClick={() => {
                setSelectedTask(record);
                setDisplayTaskModal(true);
              }}
            />
            <DeleteOutlined
              style={{ color: "red", marginLeft: 12 }}
              onClick={() => {
                onDeleteRecord(record);
              }}
            />
          </>
        );
      },
    },
  ];

  const tasks = data?.getTasksByInitiative?.map((task) => ({
    ...task,
    name: task.name,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate,
    owner: task.ownerUser.firstName + " " + task.ownerUser.lastName,
    assignee: task.assignedUser.firstName + " " + task.assignedUser.lastName,
  }));
  
  const renderTaskModal = () => (
    <Modal
      title="Add new task"
      visible={displayTaskModal}
      width={300}
      onCancel={resetTaskState}
      footer={null}
    >
      <KanbanDialogFormTemplate
        onCancelClicked={resetTaskState}
        commodityId={selectedCommodity}
        displayCTA={true}
        priority={selectedTask ? selectedTask.priority : null}
        status={selectedTask ? selectedTask.status : null}
        name={selectedTask ? selectedTask.name : null}
        assignedUserId={selectedTask ? selectedTask.assignedUserId : null}
        dueDate={selectedTask ? selectedTask.dueDate : null}
        onSaveClicked={async (data) => {
          data.moduleType = "Smart Connect";
          const variables = { data };
          if (!!selectedTask) {
            // update case
            variables.where = { id: selectedTask.Id };
            await updateTask({ variables })
              .then(async () => {
                resetTaskState();
                await refetch();
              })
              .catch();
          } else {
            data.initiativeId = initiativeId;
            await createTask({ variables })
            .then(async () => {
              resetTaskState();
              await refetch();
            })
            .catch();
          }
        }}
        supplierId={relatedOrg}
      />
    </Modal>
  );

  return (
    <div>
      <div className="add-expanded-row-button">
        <Button
          type="link"
          onClick={() => {
            setDisplayTaskModal(true);
          }}
          style={{
            marginBottom: 16,
          }}
        >
          <PlusOutlined /> Add Task
        </Button>
      </div>
      {tasks?.length > 0 && (
        <TableCard
          data={getFormattedTasks(tasks)}
          columns={groupMemberColumns}
        />
      )}
      {renderTaskModal()}
    </div>
  );
};

export default InitiativeExpandedRow;
import { gql, useMutation } from '@apollo/client';

const CREATE_TASK = gql`
  mutation createTask ($data: TaskCreateInput!) {
    createTask(data: $data) {
      Id: id
      name
      commodityId
      priority
      status
      moduleType
      dueDate
    }
  }
`;

const UPDATE_TASK = gql`
  mutation updateTask ($data: TaskUpdateInput, $where: TaskWhereUniqueInput!) {
    updateTask(data: $data, where: $where) {
      Id: id
      name
      commodityId
      priority
      moduleType
      dueDate
    }
  }
`;

const  DELETE_TASK = gql`
  mutation deleteTask($where: TaskDeleteInput!) {
    deleteTask(where: $where) {
      Id: id
    }
  }
`;

const CREATE_NOTIFICATION = gql`
    mutation createNotification($data: NotificationCreateInput!) {
        createNotification(data: $data) {
            triggeredUser {
              firstName
            }
            name
            type
        }
    }
`;

export function useCreateNotification() {
    const [createNotification] = useMutation(CREATE_NOTIFICATION);
    return createNotification;
}

export function useUpdateTask() {
  const [updateTask] = useMutation(UPDATE_TASK);
  return updateTask;
}

export function useCreateTask() {
  const [createTask] = useMutation(CREATE_TASK);
  return createTask;
}

export function useDeleteTask() {
  const [deleteTask] = useMutation(DELETE_TASK);
  return deleteTask;
}
import React, { useEffect, useRef, useState } from "react";
import PageHeader from "components/PageHeader";

import AddNewTaskBtn from './component/AddNewTaskBtn'
import CustomKanban from "./component/CustomKanban";

import { GET_TASKS } from "./graphql/query";
import WithRequestData from 'components/RequestWrapper'

import "./task.css";

import {
  useCommonidityFilter,
  useKanbanHistory,
  useKanbanUpdate
} from './hook'

export default function TaskPageWrapper() {

  return (
    <WithRequestData query={GET_TASKS}>
      {
        ({ data, refetch }) => <TaskPage data={data} refetch={refetch} />
      }
    </WithRequestData>
  )
}

export const CommodityTaskContext = React.createContext();

const TaskPage = (props) => {
  const { data: taskQueryData, refetch } = props

  const [kanbanState, kanbanFunc] = useKanbanHistory()
  const [commodityId, setCommodity] = useCommonidityFilter(taskQueryData, kanbanFunc)
  const [kanbanUpdate] = useKanbanUpdate(kanbanFunc, refetch)

  const ref = useRef()

  const [reload, setReload] = useState(false)

  // reload page header to enforce dataUpdate 
  useEffect(() => {
    setReload(true)
  }, [])
  return (
    <>
      {reload && <PageHeader
        title="Kanban Board"
        setSelectedCommodities={setCommodity}
        isList={true}
      />}
      <AddNewTaskBtn
        ref={ref}
        commodityId={commodityId && commodityId.length && commodityId[0].id}
      />
      <CommodityTaskContext.Provider value={commodityId}>
        <CustomKanban
          ref={ref}
          onActionComplete={kanbanUpdate}
          data={kanbanState.current}
        />
      </CommodityTaskContext.Provider>
    </>
  )
}


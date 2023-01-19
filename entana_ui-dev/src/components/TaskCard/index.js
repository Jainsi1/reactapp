import React from "react";
import "swiper/css";
import "swiper/css/navigation";
import "modules/Kanban/task.css";
import dateFormat from "dateformat";
import { getUserFirstName, getUserLastName } from "utils/user";
import { useQuery } from "@apollo/client";
import { GET_USER_BY_ID } from "modules/Kanban/graphql/query";

import { CommodityTaskContext } from "modules/Kanban";

const TaskCard = (props) => {

  const {
    id,
    name,
    priority,
    moduleType,
    dueDate,
    assignedUserId,
    commodityId
  } = props


  const commodityIds = React.useContext(CommodityTaskContext)
  // console.log(props)

  const { data, loading, error } = useQuery(GET_USER_BY_ID, {
    variables: { where: { id: `${assignedUserId}` } },
  });

  const assigneeInitial = data
    ? `${data.getUser.firstName.charAt(0)}${data.getUser.lastName.charAt(0)}`
    : null;

  const assigneeName = data
    ? `${data.getUser.firstName} ${data.getUser.lastName}`
    : null;


  return (
    <div >
      <div className={"flex"}>

        <div>
          {priority && (
            <div
              className={`task-priority task-priority-${priority.toLowerCase()}`}
            >
              <span
                className={`task-priority-text task-priority-text-${priority.toLowerCase()}`}
              >
                {priority}
              </span>
            </div>
          )}
        </div>
        <div className={"ml-auto w-fit pr-5"}>
          COMMODITY: {" "}
          <strong>
            {commodityIds && commodityIds.length && commodityIds.find(e => e.id == commodityId)?.name}
          </strong>
        </div>
      </div>

      <div className="name-tag">
        <div>
          <div className="name-tag-text">{name}</div>
        </div>
      </div>

      <div className="margin">
        {moduleType && (
          <div className={`task-module`}>
            <span className="task-module-text">{moduleType}</span>
          </div>
        )}
      </div>

      <div className="margin flex">
        <div className="due-date">
          {dueDate && (
            <p className="due-date-text">
              {dateFormat(dueDate, "mmmm dS, yyyy")}
            </p>
          )}
        </div>
        <div className={"ml-auto w-fit"}>
          <div className="user-initial-image w-full" title={`Assignee: ${assigneeName}`} data-initials={assigneeInitial}>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;

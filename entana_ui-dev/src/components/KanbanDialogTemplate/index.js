import React, { useState, useRef, useEffect } from 'react';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import { useLazyQuery, useQuery } from '@apollo/client';
import { GET_USERS_WITH_COMMODITY_ACCESS } from 'modules/Kanban/graphql/query';
import { Query } from '@syncfusion/ej2-data';
import Loader from 'components/loaders/Loader';
import Page404 from 'components/Page404';
import { getUserFirstName, getUserLastName } from 'utils/user';
import { Button } from 'antd';
import { CommodityTaskContext } from 'modules/Kanban';
import WithRequestData from 'components/RequestWrapper';

import { GET_COMMODITIES } from 'components/PageHeader/graphql/query';
import { getUserId } from 'utils/user';

const moduleData = ["Smart Connect", "Cost Management", "Roadmap Planning", ""];
const statusData = ["To do", "In progress", "Completed"];
const priorityData = ["Low", "Medium", "High"];
const fields = { text: "Assignee", value: "id" };
const commodityField = { text: "name", value: "id" }

const KanbanDialogFormTemplate = ({
  name,
  priority,
  moduleType,
  status,
  dueDate,
  assignedUserId,
  commodityId,
  ownerUserId,
  displayCTA,
  onCancelClicked,
  onSaveClicked,
  supplierId,
  data: allCommodities
}) => {

  // TODO: NEED TO REFACTOR ALL OF THIS, I hate this code
  const commodityElement = useRef();
  const statusElement = useRef();
  const nameElement = useRef();
  const priorityElement = useRef();
  const assigneeElement = useRef();
  const dueDateElement = useRef();

  const [newTaskCommodity, setNewTaskCommodity] = useState(commodityId);

  const [Name, setName] = useState(name);
  const [queryAssinee,  { data, loading, error }] = useLazyQuery(GET_USERS_WITH_COMMODITY_ACCESS, {
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    setName(name);
  }, [name])


  useEffect(() => {
    queryAssinee({variables: { commodityId: newTaskCommodity, organizationId: supplierId }});
  }, [newTaskCommodity])

  const taskDetail = {
    priority: priority,
    moduleType: moduleType,
    status: status,
    dueDate: dueDate,
  };




  if (loading) return <Loader />;
  if (error) return <Page404 error={error} />;


  const assigneeData = data?.getUsersWithCommodityAccess.map((user) => {
    return {
      id: `${user.Id}`,
      Assignee: `${user.firstName} ${user.lastName}`,
    };
  });

  const ownerName = ownerUserId
    ? assigneeData?.find((user) => user.id == ownerUserId).Assignee
    : `${getUserFirstName()} ${getUserLastName()}`;

  const onChange = (args) => {
    setName(args.target.value);
  };

  const onFiltering = (args) => {
    let query = new Query();
    query =
      args.text !== ""
        ? query.where("Assignee", "startswith", args.text, true)
        : query;
    args.updataData(assigneeData, query);
  };

  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td className="e-label">Owner</td>
            <td>{ownerName}</td>
          </tr>

          <tr>
            <td className="e-label">Commodity:</td>
            <td>
              <DropDownListComponent
                ref={commodityElement}
                id="commodityId"
                name="commodityId"
                fields={commodityField}
                dataSource={allCommodities}
                onChange={e => { setNewTaskCommodity(e.target.value); }}
                className="e-field"
                placeholder="Commodity Name"
                value={newTaskCommodity}
              />
            </td>
          </tr>
          <tr>
            <td className="e-label">Status</td>
            <td>
              <DropDownListComponent
                ref={statusElement}
                id="status"
                name="status"
                dataSource={statusData}
                className="e-field"
                placeholder="Choose Status"
                value={taskDetail.status}
              />
            </td>
          </tr>
          <tr>
            <td className="e-label">Name</td>
            <td>
              <textarea
                ref={nameElement}
                name="name"
                className="e-field"
                value={Name}
                placeholder={Name}
                onChange={onChange}
              />
            </td>
          </tr>
          <tr>
            <td className="e-label">Priority</td>
            <td>
              <DropDownListComponent
                ref={priorityElement}
                id="priority"
                name="priority"
                dataSource={priorityData}
                className="e-field"
                placeholder="Choose Priority"
                value={taskDetail.priority}
              />
            </td>
          </tr>
          {!displayCTA && (
            <tr>
              <td className="e-label">Module</td>
              <td>
                <DropDownListComponent
                  id="moduleType"
                  name="moduleType"
                  dataSource={moduleData}
                  className="e-field"
                  placeholder="Choose Module"
                  value={taskDetail.moduleType}
                />
              </td>
            </tr>
          )}
          <tr>
            <td className="e-label">Assignee</td>
            <td>
              <DropDownListComponent
                ref={assigneeElement}
                id="assignedUserId"
                name="assignedUserId"
                fields={fields}
                dataSource={assigneeData}
                allowFiltering={true}
                onFiltering={onFiltering}
                className="e-field"
                placeholder="Assign task to"
                value={assignedUserId}
              />
            </td>
          </tr>
          <tr>
            <td className="e-label">Due Date</td>
            <td>
              <DatePickerComponent
                ref={dueDateElement}
                id="dueDate"
                className="e-field"
                format="MM/dd/yyyy"
                value={taskDetail.dueDate}
              />
            </td>
          </tr>
        </tbody>
      </table>
      {displayCTA && (
        <div style={{ marginTop: 15, display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="primary"
            htmlType="submit"
            onClick={() => {
              onSaveClicked({
                assignedUserId: assigneeElement.current.value,
                commodityId: newTaskCommodity,
                dueDate: dueDateElement.current.value,
                name: nameElement.current.value,
                priority: priorityElement.current.value,
                status: statusElement.current.value
              });
            }}
          >
            Save
          </Button>
          <Button
            onClick={onCancelClicked}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

const KanbanDialogFormTemplateWrapper = (props) => {


  return (
    <WithRequestData query={GET_COMMODITIES} variables={{ where: { id: getUserId() } }}>
      {
        ({ data }) => <KanbanDialogFormTemplate data={data.getCommodities} {...props} />
      }
    </WithRequestData>

  )
}

export default KanbanDialogFormTemplateWrapper;

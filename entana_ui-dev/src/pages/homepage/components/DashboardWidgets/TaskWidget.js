import Task from 'assets/images/Task.svg';
import { NavLink } from 'react-router-dom';
import { GET_TASKS } from 'modules/Kanban/graphql/query';
import WithRequestData from 'components/RequestWrapper';
import DashboardStatics from './DashboardStatics';


export default function TasksWidget (props)  {
    const {selectedCommodity} = props;
    const commodityIds = selectedCommodity.map(e => parseInt(e.id));

    return (
        <WithRequestData query={GET_TASKS}>
            {
                ({ data }) => <TasksWidgetContent data={data} selectedCommodity={commodityIds} />
            }
        </WithRequestData>
    )
}

const TasksWidgetContent = (props) =>{

    const { data, selectedCommodity } = props;
    const filteredTasks = data?.getTasks?.tasks?.filter(task => {
        return selectedCommodity.includes(parseInt(task.commodityId))    && task.status !== 'Completed'
    })
    
    return (
        <DashboardStatics
            title="Pending Tasks"
            header={filteredTasks.length}
            image={Task}
            imageColor="cube-image"
            toolTip="Count of tasks not yet complete"
            extra={
                <>
                    <span className="last-card-paragraph-highlight">
                        <NavLink to="/task">See Tasks </NavLink>
                        <span className="last-card-paragraph">
                            which are pending completion
                        </span>
                    </span>
                </>
            }
        />
    )
};
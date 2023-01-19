import { CardWithTitle, useFilter } from "./component/CustomCard"
import { Table, Typography } from 'antd'

const {Title} =Typography

function groupByName(data) {
    const result = {}

    for (const capacity of data) {
        if (capacity.groupName in result) {
            result[capacity.groupName].push(capacity)
        } else {
            result[capacity.groupName] = [capacity]
        }
    }

    return result
}

function formatColumnsName(value) {
    return {
        title: value.toUpperCase(),
        key: value,
        dataIndex: value,
    }
}

function formatDataRow(value, idx) {
    return {
        key: idx,
        ...value,
    }
}

const TableGroup = (props) => {
    const { groupName, group } = props;
    const columns = ['name', ...group[0].tableColumn].map(e => formatColumnsName(e))
    const dataSource = group.map((e, idx) => formatDataRow({ ...e.tableData, name: e.name }, idx))



    return (
        <div className={"mb-12"}>
            <Title level={5} className={"text-center bg-gray-50 p-5"}>{groupName.toUpperCase()}</Title>
            <Table dataSource={dataSource} columns={columns} />
        </div>
    )
}


function getCapacityPerFactories(e) {
    return Object.entries(e).map(([groupName, group], idx) => <TableGroup groupName={groupName} group={group} key={idx} />)
}

function formatOption(value, idx) {

    return {
        key: idx,
        value: idx,
        label: `Factory: ${value}`
    }
}

export default function CapacityTab(props) {

    const { factories } = props;

    const [data, setFilter] = useFilter( factories, (e, filterOption, idx) => idx === filterOption)
    
    const groupByNameCapacityList = data.map(e => e.capacities).map(e => groupByName(e));

    const factoriesName = factories.map((e,idx ) => formatOption(e.name, idx));


    return (
        <CardWithTitle title="Factory Capacity" options={factoriesName} setFilter={setFilter}>
            {
                groupByNameCapacityList.map(e => getCapacityPerFactories(e))
            }
        </CardWithTitle>
    )
}
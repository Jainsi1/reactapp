import { CardWithTitle, useFilter } from "./component/CustomCard"
import CustomMap from "./component/Map"
import { Typography, Table } from "antd";

import { ProfileContext } from "pages/organizationProfile";
import { useContext} from "react";

const { Title } = Typography

function formatColumnsName(value) {
    return {
        title: value.toUpperCase(),
        key: value.replace(' ', '_').toLowerCase(),
        dataIndex: value.replace(' ', '_').toLowerCase(),
    }
}

const columns = [
    {
        ...formatColumnsName('Tier'),
        width: "10%"
    },
    {
        ...formatColumnsName('Organization'),
        width: "30%"
    },
    {
        ...formatColumnsName('Address'),
    },
]

function formatOption(value, idx) {

    return {
        key: idx,
        value: idx,
        label: `Tier ${value}`
    }
}

function formatDataRow(value, idx) {
    return {
        key: idx,
        ...value,
    }
}

function processLocation(e) {
    return {
        ...e.location,
        tier: e.tier
    }
}



export default function LocationTab(props) {

    const { name } = useContext(ProfileContext);
    const { factories } = props;

    const locations = factories.map(e => {
        return {
            ...e.location,
            name: e.name,
        }
    })

    const options = Array.from(new Set(factories.map(e => e.tier)))
        .map((e, idx) => formatOption(e, idx))
    const dataSource = factories.map(e => processLocation(e))
        .map((e, idx) => formatDataRow({ ...e, organization: name }, idx))

    const [data, setFilter] = useFilter(dataSource, (e, filterOption) =>  e.tier === filterOption);



    return (
        <CardWithTitle title="Supply Chain" options={options} setFilter={setFilter}>
            <CustomMap locations={locations} />
            <Title level={4} className={" mt-5 mb-5"}>Location</Title>
            <Table dataSource={data} columns={columns} />
        </CardWithTitle>
    )
}
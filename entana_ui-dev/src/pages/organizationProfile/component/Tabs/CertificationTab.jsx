import { CardWithTitle, useFilter } from "./component/CustomCard"
import { Table, Typography } from 'antd'

const { Title } = Typography

function formatColumnsName(value) {
    return {
        title: value.toUpperCase(),
        key: value,
        dataIndex: value,
    }
}

function formatDataRow(value, idx) {
    return [{
        key: idx,
        ...value,
    }]
}

const CustomTable = (props) => {
    const { value } = props

    const SourceColumn = {
        title: 'SOURCE',
        key: 'source',
        dataIndex: 'source',
        render: (value) => {

            if (value)
                return (
                    <a href={new URL (value, process.env.REACT_APP_AWS_URL).href} target="_blank" rel="noopener">
                        View
                    </a>
                )
            else {
                return (
                    <div>-</div>
                )
            }
        }
    }

    const columns = value.map(e => ['name', ...e.tableColumn].map(e => formatColumnsName(e)))
    columns.forEach(e => e.push(SourceColumn))

    const dataSource = value.map((e, idx) => formatDataRow({ ...e.tableData, name: e.name, source: e.source }, idx))


    return (
        <div className={"mb-12"}>
            {value.map((_, idx) => (<Table dataSource={dataSource[idx]} columns={columns[idx]} className={"md-3"} key={idx} />))}
        </div>
    )
}

function formatOption(value, idx) {

    return {
        key: idx,
        value: idx,
        label: `Factory: ${value}`
    }
}

const FactoryCertificationTable = (props) => {
    const { factoriesName, cert } = props

    return (
        <div className={"mb-20"}>
            <Title level={5} className={"text-center bg-gray-50 p-5"}>{factoriesName}</Title>
            {cert.length ? <CustomTable value={cert} /> : <p className={"text-center"}>No Certification for this Factory</p>}
        </div>
    )
}

export default function CertificationTab(props) {

    const { factories } = props;
    const [data, setFilter] = useFilter(factories, (option, idx) => option == idx)

    const certificationsFactory = data.map(e => e.certifications)
    const factoriesNames = factories.map((e, idx) => formatOption(e.name, idx))

    return (
        <CardWithTitle title="Certifications" options={factoriesNames} setFilter={setFilter}>
            {certificationsFactory.map((e, idx) => <FactoryCertificationTable key={idx} cert={e} factoriesName={factoriesNames[idx].label} />)}
        </CardWithTitle>
    )
}
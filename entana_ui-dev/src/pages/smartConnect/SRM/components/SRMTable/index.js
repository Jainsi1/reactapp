import React from "react";
import TableCard from "components/TableCard/index";
import { getUserFirstName, getUserLastName } from "utils/user";
import ActionsTable from "components/ActionsTable";
import riskTable from "components/TableTag/riskTable";

import BusinessTableCard from "pages/smartConnect/components/BusinessTableCard";
import { SRMContext } from "pages/smartConnect/SRM";

import { useContext } from "react";

import {
    tableTitle,
    tableDataText,
} from "utils/table";

const RiskColumns = [
    {
        title: "#",
        dataIndex: "no",
        render: tableDataText,
    },
    {
        title: "Product",
        dataIndex: "product",
        render: tableTitle,
    },
    {
        title: "LTB",
        dataIndex: "ltb",
        render: tableDataText,
    },
    {
        title: "LTS",
        dataIndex: "lts",
        render: tableDataText,
    },
    {
        title: "SUCCESSOR",
        dataIndex: "successor",
        render: tableDataText,
    },
    {
        title: "IS POR?",
        dataIndex: "isPor",
        render: tableDataText,
    },
    {
        title: "SUCCESSOR GA",
        dataIndex: "successorGa",
    },
    {
        title: "QUAL STATUS",
        dataIndex: "qualStatus",
        render: tableDataText,
    },
    {
        title: "Transition Gap",
        dataIndex: "transitionGap",
        render: riskTable,
    },
    {
        title: "COMMODITY",
        dataIndex: "commodityId",
    },
    {
        title: "ACTIONS",
        dataIndex: "actions",
        render: (text, record) => <ActionsTable text={text} record={record} />,
    },
];


export const EOLTableCard = (props) => {
    const { title } = props;
    const { currentSupplier, eolRiskItemsMap, commodity } = useContext(SRMContext);

    const tableData = eolRiskItemsMap?.[currentSupplier.commodityId]?.[currentSupplier.id]

    if (tableData) {
        tableData.forEach((e) => {
            e.commodityId = commodity.find(({ id }) => id === e.commodityId).name
        })
    }

    return (
        <div className="table-main-card">
            <TableCard
                title={title}
                data={tableData || []}
                columns={RiskColumns}
            />
        </div>
    )
}


export default function CustomTableCard(props) {
    const { title, filter } = props;

    const { currentSupplier, initiativeDataMap, commodity } = useContext(SRMContext);

    const initiative = initiativeDataMap?.[currentSupplier?.commodityId]?.[currentSupplier?.id]


    let tableData = []
    if (initiative && initiative.length) {
        tableData = initiative.filter((obj) => obj.type === filter)
            .map((initiative) => {
                return {
                    no: initiative.id,
                    title: initiative.title,
                    plan: initiative.plan,
                    businessObjective: initiative.businessObjective,
                    expectedBenefit: initiative.expectedBenefit,
                    current: initiative.current,
                    numTasks: initiative.numTasks,
                    commodityId: commodity?.find(({ id }) => id === initiative.commodityId)?.name || "-",
                    lead: `${getUserFirstName()
                        .charAt(0)
                        .toUpperCase()}${getUserFirstName().slice(1)} ${getUserLastName()
                            .charAt(0)
                            .toUpperCase()}.`,
                    // lob: "ISG-SSD",
                };
            });
    }

    return (
        <div className="table-main-card">
            <BusinessTableCard
                title={title}
                data={tableData}
                relatedOrg={currentSupplier.id}
                onInitiativesChanged={() => { console.log("initiatives changed") }}
            />
        </div>
    )

}
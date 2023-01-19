import { Select, Tag } from "antd";
import { useEffect, useState } from "react";

const { Option } = Select;


const dropdown = [
    {
        id: 1,
        name: "QBR Score",
        label: "QBR",
        display: true
    },
    {
        id: 2,
        name: "Run The Business",
        label: "RTB"
    },
    {
        id: 3,
        name: "Change The Business",
        label: "CTB"
    },
    {
        id: 4,
        name: "EOL Risks",
        label: "EOL"
    },
    // { id: 5, name: "Sole Source Risk", label: "Sole Source" },
    // { id: 6, name: "Org Hierarchy", label: "Org Hierarchy" },
    // { id: 7, name: "Event Management", label: "Event Management" },
];



export default function SRMDropdown(props) {
    const { setVisible} = props;

    useEffect(() => {
        const map = {};

        dropdown.filter(e => e.display).forEach((e) => {map[e.label] = true})

        setVisible(map);
    }, [])

    function onChange(list) {
        const map = {};

        list.forEach((e) => {map[dropdown.find(d => d.id === e).label] = true})

        setVisible(map);
    }

    return (
        <Select
            mode="multiple"
            maxTagCount={1}
            maxTagTextLength={3}
            placeholder="Please select"
            onChange={onChange}
            style={{
                width: "90%",
            }}
            tagRender={({ label }) => <Tag>{label}</Tag>}
            defaultValue={dropdown.filter(e => e.display).map(e => e.id)}
        >
            {dropdown.map((option) => (
                <Option
                    key={option.id}
                    value={option.id}
                    label={option.label}
                >
                    {option.name}
                </Option>
            ))}
        </Select>

    )
}
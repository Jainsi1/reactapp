import React, { useEffect } from "react";
import { Row, Col, Select } from "antd";
import { GET_COMMODITIES } from "./graphql/query";
import { getUserId } from "utils/user";
import "./pageHeader.css";
import WithRequestData from "components/RequestWrapper";
import useLocalStorage from "hook/useLocalStorage";

const { Option } = Select;
const NUM_OF_DEFAULT_COMMODITIES = 1;

export default function PageHeaderWrapper(props) {
  const variables = { where: { id: getUserId() } };

  return (
    <WithRequestData query={GET_COMMODITIES} variables={variables}>
      {
        ({ data }) => <PageHeader {...props} data={data?.getCommodities} />
      }
    </WithRequestData>
  )
}


const useSelectCommodity = (allCommodities, parentScopeSetSelectedCommodities) => {
  const [selectedCommodities, setSelectedCommodities] = useLocalStorage('selectedCommodities', allCommodities.slice(0, NUM_OF_DEFAULT_COMMODITIES));

  useEffect(() => {
    parentScopeSetSelectedCommodities && parentScopeSetSelectedCommodities(selectedCommodities)
  }, [selectedCommodities]);

  return [selectedCommodities, setSelectedCommodities];
}

const PageHeader = (props) => {
  const {
    title,
    setSelectedCommodities: parentScopeSetSelectedCommodities,
    setAllCommodities,
    children,
    data: allCommodities
  } = props

  setAllCommodities && setAllCommodities(allCommodities); // set all commodities to parent component
  const [selectedCommodities, _setSelectedCommodities] = useSelectCommodity(allCommodities, parentScopeSetSelectedCommodities);

  return (
    <div className="dashboard-main-text">
      <h2>{title}</h2>
      <div className={"flex"}>
        {children}
        <CommoditySelection
          options={allCommodities}
          setSelectedCommodities={_setSelectedCommodities}
          value={selectedCommodities} />
      </div>
    </div>
  );

};

const CommoditySelection = (props) => {
  const { options, value, setSelectedCommodities } = props

  function onChange(event) {
    if (event.length === 0) return;

    const selectCommodity = options.filter(e => event.includes(e.id))
    setSelectedCommodities(selectCommodity);
  }

  return (
    <Select
      mode="multiple"
      maxTagTextLength={3}
      maxTagCount={1}
      placeholder="Please select a commodity first"
      onChange={onChange}
      //   defaultValue={options[0].id}
      className="w-32 commodity-selector"
      value={value.map(e => e.id)}
    >
      {options.map((option) => (
        <Option key={option.id} value={option.id}>
          {option.name}
        </Option>
      ))}
    </Select>
  )
}



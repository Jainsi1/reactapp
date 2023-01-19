import { Select, Tag } from "antd";
import { useContext, useEffect, useState } from "react";
import { SRMContext } from "../../index";

const { Option } = Select;

export default function SupplierDropdown({ setVisibleSuppliers }) {
  const { currentSupplier, suppliers, visibleSuppliers } = useContext(SRMContext)

  function onChange(id) {
    setVisibleSuppliers(id)
  }

  useEffect(() => {
    const ids = suppliers?.slice(0, 4)?.map(({ id }) => id);
    setVisibleSuppliers(ids)
  }, [suppliers?.length]);

  return (
    <Select
      placeholder="Please select"
      mode="multiple"
      maxTagCount={1}
      maxTagTextLength={3}
      tagRender={({ label }) => <Tag>{label}</Tag>}
      showSearch
      filterOption={(input, option) => (option?.label ?? '').includes(input)}
      onChange={onChange}
      style={{
        width: "90%",
      }}
      value={visibleSuppliers}
    >
      {suppliers.map((option) => (
        <Option
          key={option.id}
          disabled={currentSupplier?.id == option.id}
          value={option.id}
          label={option.name}
        >
          {option.name}
        </Option>
      ))}
    </Select>

  )
}
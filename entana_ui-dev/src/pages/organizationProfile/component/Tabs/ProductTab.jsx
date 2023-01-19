import { Col, Input, Row, Select, Typography } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import ProductRow from "./ProductRow";
import debounce from 'lodash.debounce';

const { Title } = Typography;
const Option = Select.Option;

const ProductTab = ({ organizationId, commodities }) => {

  const [search, setSearch] = useState("");
  const [commodityId, setCommodityId] = useState(null);

  const changeHandler = (event) => {
    setSearch(event.target.value);
  };
  const debouncedChangeHandler = useMemo(
    () => debounce(changeHandler, 300)
    , []);

  // after unmounting
  useEffect(() => {
    return () => {
      debouncedChangeHandler.cancel();
    }
  }, []);

  function getCommodities() {
    const newCommodities = JSON.parse(JSON.stringify(commodities));
    newCommodities.unshift({
      id: null,
      name: "Generic"
    })
    return newCommodities;
  }

  return (
    <>
      <div className="card-box">
        <div className="card-inside">
          <Row type="flex"
               align="middle"
               className="card-header"
               gutter={16}>
            <Col xs={24} md={12}>
              <Row
                type="flex"
                align="baseline"
                gutter={16}
              >
                <Col xs={24} md={6}><Title level={4}>Products</Title></Col>
                <Col xs={24} md={18}>
                  <Input
                    placeholder="Search for products"
                    className="input-rounded"
                    bordered={false}
                    onChange={debouncedChangeHandler}
                  />
                </Col>
              </Row>
            </Col>
            <Col xs={24} md={12}>
              <Row
                type="flex"
                align="baseline"
                gutter={16}
              >
                <Col xs={24} md={8}><Title level={5}>Commodity/Category</Title></Col>
                <Col xs={24} md={12}>
                  <Select
                    style={{ width: "100%" }}
                    onChange={e => setCommodityId(e)}
                  >
                    {getCommodities()?.map((option) => (
                      <Option key={option.id} value={option.id}>
                        {option.name}
                      </Option>
                    ))}
                  </Select>
                </Col>
              </Row>
            </Col>
          </Row>

          <ProductRow
            organizationId={organizationId}
            commodityId={commodityId}
            search={search}
          />

        </div>
      </div>
    </>
  )
}

export default ProductTab;
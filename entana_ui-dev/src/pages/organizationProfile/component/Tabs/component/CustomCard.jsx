import "./map.css"
import { Card, Col, Typography, Table } from "antd";
import { Select, Row } from 'antd';
import { useState, useEffect } from 'react';


const { Title } = Typography;

const defaultImg =  undefined;//new URL (process.env.REACT_APP_DEFAULT_IMG, process.env.REACT_APP_AWS_URL).href

export const ProductItem = (props) => {
  let { product, isService } = props
  const { imageUrl, name, production_status: status, model, mpn } = product

  return (
    <Col xs={24} md={6} xl={8} key={product.id}>
      <Card bordered={false} className={"card"} >
        <div className="flex gap-3 h-60">
          <img className="flex-auto w-1/3 " src={imageUrl ? new URL (imageUrl, process.env.REACT_APP_AWS_URL).href : defaultImg} alt="" />
          <div className="flex-auto w-1/3">
            {name && <h2 h2 className="card-heading">{name}</h2>}
            {isService || <p className="card-para">Production Status: {status}</p>}
            {mpn && <p className="card-para-small" style={{ lineHeight: "87%" }}>MPN: {mpn}</p>}
            {model && <p className="card-para-small">Model: {model}</p>}
          </div>
        </div>
      </Card>
    </Col >
  )
}

const SelectFilter = (props) => {
  const { options, setFilter } = props

  function onChange(idx) {
    setFilter(idx)
  }

  return (
    <Select
      placeholder="Please select"
      onChange={onChange}
      options={options}
      defaultValue={options[0].value}
      className={"fit-content float-right"}
    >
    </Select>
  )
}

export const useFilter = (dataSource, filterFunc) => {

  const [filterOption, setFilter] = useState(-1)
  const [data, setData] = useState(dataSource)

  useEffect(() => {
    if (filterOption != -1) {
      const newData = dataSource.filter((e, idx) => {
        return filterFunc(e, filterOption, idx)
      })
      setData(newData)
    } else {
      setData(dataSource)
    }
  }, [filterOption])

  return [data, setFilter]
}

export const CardWithTitle = (props) => {
  const { title, children, options, setFilter } = props

  const deafultAll =      {
        key: -1,
        value: -1,
        label: `All`
      }


  return (
    <div className="card-box">
      <Card className={"border-none m-2"} >
        <div className="mb-5">
          {options && <SelectFilter options={[deafultAll, ...options]} setFilter={setFilter} />}
          <Title level={4}>{title}</Title>
        </div>
        {children}
      </Card>
    </div>
  )
}

export const ProductList = (props) => {
  const { products, isService } = props

  return (
    <Row gutter={16} style={{ rowGap: 16 }} >
      {
        products ?
          products.map((product, idx) => <ProductItem product={product} key={idx} isService={isService} />) :
          <p>No products</p>
      }
    </Row>
  )
}
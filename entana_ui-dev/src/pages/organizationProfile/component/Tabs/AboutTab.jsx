import { Row, Typography } from "antd";
import React, { useState } from "react";
import { CardWithTitle, ProductItem, ProductList } from "./component/CustomCard";
import CustomMap from "./component/Map";

const { Paragraph } = Typography;

const AboutCard = (props) => {
  const { content } = props
  const [ellipsis] = useState(true);

  return (

    <CardWithTitle title="About">
      <Paragraph
        ellipsis={
          ellipsis
            ? {
              rows: 2,
              expandable: true,
              symbol: 'more',
            }
            : false
        }
      >
        {content}
      </Paragraph>
    </CardWithTitle>
  )
}

const ProductShowcaseCard = (props) => {
  const { products, } = props

  return (
    <CardWithTitle title='Product Showcase'>
      <ProductList products={products} />
    </CardWithTitle>
  )
}

const MapCard = (props) => {
  return (
    <CardWithTitle title="Locations">
      <CustomMap {...props} />
    </CardWithTitle>
  )
}

const HashTagCard = (props) => {
  const { content } = props
  const title = "Hash Tags"


  return (
    <CardWithTitle title={title}>
      {content || <p>No Tag For This</p>}
    </CardWithTitle>
  )
}

const AboutTab = (props) => {
  const { organization, hasSuppliers, permissions } = props;


  let locations;
  if (permissions?.locationPermission?.allow === false) { 
    locations = false; 
  }else {
    locations = organization.factories.map(e => {
      return {
        ...e.location,
        name: e.name
      }
    });
  }


  return (
    <>
      <AboutCard content={organization.about} />
      {hasSuppliers && <ProductShowcaseCard products={organization.products} />}
      {hasSuppliers && <MapCard locations={locations} />}

      <HashTagCard content={organization.hashTag} />
    </>
  )
}

export default AboutTab;
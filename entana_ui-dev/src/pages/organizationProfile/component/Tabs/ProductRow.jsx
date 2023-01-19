import { Card, Col, Row } from "antd";
import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_ORGANIZATION_PRODUCT } from "./graphql/query";
import {ProductList} from "./component/CustomCard"

const ProductRow = ({ organizationId, search = "", commodityId }) => {

  const { data, loading, error, refetch } = useQuery(GET_ORGANIZATION_PRODUCT, {
    variables: {
      data: {
        id: organizationId,
      }
    }
  });

  useEffect(() => {
    if ( !loading) {
      refetch({
        data: {
          commodity_id: parseInt(commodityId),
          search: search,
          id: organizationId
        }
      }).then()
    }
  }, [search, commodityId]);


  if (loading) return <div>Loading Products...</div>;
  if (error) return <p>Error {":( "}</p>;

  return (
    <ProductList products={data.getOrganizationProducts}/>
  )
}
export default ProductRow;
import React, { useRef, useState } from 'react';
import QBRTemplateCreate from "./create";
import QBRTemplateList from "./list";
import QBRTemplateEdit from "./edit";
import { getUserId } from "utils/user";
import { useQuery } from "@apollo/client";
import { GET_COMMODITIES } from "../PageHeader/graphql/query";

const QBRTemplateContainer = () => {

  const [isAdding, setIsAdding] = useState(false);
  const [qbrTemplateId, setQbrTemplateId] = useState(0);

  const variables = { where: { id: getUserId() } };
  const { data, loading, error } = useQuery(GET_COMMODITIES, {
    variables,
    fetchPolicy: "network-only",
  });


  const onAddToggle = (id = null) => {
    console.log(id)
    setQbrTemplateId(id)
    setIsAdding( !isAdding)
  }

  if (loading) return <p className="tw-text-center">Loading Qbr Templates...</p>;
  if (error) return <p>Error :(</p>;

  if (isAdding) {
    return (
      Boolean(qbrTemplateId) ?
        <QBRTemplateEdit
          commodities={data?.getCommodities}
          onAdd={onAddToggle}
          qbrTemplateId={qbrTemplateId}
        /> :
        <QBRTemplateCreate
          commodities={data?.getCommodities}
          onAdd={onAddToggle}
        />
    )
  }

  return (
    <QBRTemplateList onAdd={onAddToggle}/>
  );
};

export default QBRTemplateContainer;

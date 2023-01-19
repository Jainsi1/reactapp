import React from 'react';
import { Button, Table, Space, } from 'antd';
import { useMutation, useQuery } from "@apollo/client";
import { GET_POSTS } from "../NewsFeed/graphql/Query";
import { GET_QBR_TEMPLATES } from "./graphql/Query";
import { ADD_POST } from "../NewsFeed/graphql/Mutation";
import { MAKE_DEFAULT_QBR_TEMPLATE } from "./graphql/Mutation";
import moment from "moment";

const QBRTemplateList = (props) => {
  const { onAdd } = props;

  const { loading, error, data } = useQuery(GET_QBR_TEMPLATES, {
    fetchPolicy: "network-only",
  });

  const AddNewTemplate = () => {
    onAdd()
  }

  const [makeDefaultQbrTemplate] = useMutation(MAKE_DEFAULT_QBR_TEMPLATE)

  const onMakeQbrDefault = (id) => {
    makeDefaultQbrTemplate({
      variables: {
        where: { id }
      },
      refetchQueries: [GET_QBR_TEMPLATES]
    }).then(() => {

    })
  }

  const onEdit = (id) => {
    console.log("calling onEdit")
    onAdd(id)
  }

  if (loading) return <p className="tw-text-center">Loading Qbr Templates...</p>;
  if (error) return <p>Error :(</p>;

  const mapDataSources = (data) => {
    data = [...data];

    if ( !data?.length) return [];

    return data.map(function (item) {
      return {
        key: item.id,
        ...item
      };
    })
  }

  const columns = [
    {
      title: 'Template Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Commodities',
      key: 'commodities',
      render: (_, { commodities }) => {
        return commodities?.join(', ')
      }
    },
    {
      title: 'Created On',
      key: 'created_at',
      render: (_, record) => {
        return moment(record.created_at).format('D/M/Y')
      }
    },
    {
      title: 'Edited On',
      key: 'updated_at',
      render: (_, record) => {
        return moment(record.updated_at).format('D/M/Y')
      }
    },
    {
      title: 'Is Default?',
      key: 'is_default',
      render: (_, record) => (
        <Space size="middle">
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a
            onClick={() => !record.is_default && onMakeQbrDefault(record.id)}>{record.is_default ? "Yes" : "Make Default"}</a>
        </Space>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a onClick={() => onEdit(record.id)}>Edit</a>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Button type="primary" onClick={AddNewTemplate}>
        Add New Template
      </Button>
      <Table style={{
        marginTop: '30px',
      }} columns={columns} dataSource={mapDataSources(data.getQbrTemplates)}/>
    </>
  );
};

export default QBRTemplateList;

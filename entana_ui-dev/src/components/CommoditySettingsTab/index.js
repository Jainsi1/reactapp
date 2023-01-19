import React, { useState }  from 'react';
import { useQuery } from '@apollo/client';
import { Input, Button, Table } from 'antd';
import { getCurrentGroup } from 'utils/user';
import { useCreateCommodity } from './graphql/mutation';
import openNotification from 'utils/Notification';
import { GET_GROUP_COMMODITIES } from './graphql/query';
import Loader from 'components/loaders/Loader';
import Page404 from 'components/Page404';
import { useNavigate } from 'react-router-dom';

const group = getCurrentGroup();

const getCommoditiesData = (commodities) => {
  if (!commodities) return [];

  return commodities.map(commodity => {
    return {
      ...commodity,
      key: commodity.id
    }
  })
}

const CommoditySettingsTab = () => {
  const navigate = useNavigate();
  const [commodityName, setCommodityName] = useState('');
  const createCommodity = useCreateCommodity();

  const CommodityColumns = [
    {
      title: "#",
      dataIndex: "no",
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => {
        return (
          <>
            <a onClick={() => {
              navigate(`/commodity/${record.id}`);
            }}>{text}</a>
          </>
        );
      },
    }
  ]; 

  const variables = { groupId: group.id };
  const { data, loading, error, refetch } = useQuery(GET_GROUP_COMMODITIES, {
    variables,
    fetchPolicy: 'network-only'
  });
  const commodities = getCommoditiesData(data?.getGroupCommodities);

  const onAddCommodity =  async () => {
    const data = {
      name: commodityName,
      groupId: group.id
    };
    const variables = { data };
    await createCommodity({ variables })
        .then(({ data }) => {
          if (data) {
            openNotification('success', 'Commodity created successfully');
            refetch();
          } else {
            openNotification('error', 'Error while creating commodity');
          }
        })
        .catch((error) => {
          console.log(error)
          openNotification('error', 'Error while creating commodity');
        });
  }

  if (loading) return <Loader/>;
  if (error) return <Page404 error={error}/>;

  return (
    <>
      <Input.Group compact>
        <Input
          style={{
            width: '300px',
          }}
          placeholder="commodity name"
          onChange={(event) => setCommodityName(event.target.value)}
        />
        <Button disabled={!commodityName || commodityName === ''} type="primary" onClick={onAddCommodity}>Add
          commodity</Button>
      </Input.Group>
      {
        commodities?.length > 0 && (
          <Table
            columns={CommodityColumns}
            rowKey={(record) => record.key}
            expandable={{
              rowExpandable: () => false,
            }}
            dataSource={commodities}
            size="small"
            scroll={{ x: true }}
            pagination={false}
          />
        )
      }
    </>
  )
}

export default CommoditySettingsTab;
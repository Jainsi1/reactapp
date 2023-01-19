import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Dropdown, Form, Input, Menu, Modal, Row, Select, Space, Typography } from "antd";
import DashboardCard from "components/DashboardCard";
import GradientChart from "components/Chart/GradientChart";
import "./style.css";
import { DownOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import ViewIcon from "assets/images/view.svg"
import AddIcon from "assets/images/add.svg"
import EditIcon from "assets/images/edit.svg"
import DeleteIcon from "assets/images/delete.svg"
import FreezeIcon from "assets/images/tick.svg"
import { useMutation, useQuery } from "@apollo/client";
import { GET_QBR_SCORES, GET_QUARTERS } from "./graphql/query";
import CreateScoreModal from "./modal/create";
import ViewScoreModal from "./modal/view";
import openNotification from "utils/Notification";
import { FREEZE_QBR_SCORE, REMOVE_QBR_SCORE } from "./graphql/mutation";
import EditScoreModal from "./modal/edit";
import Widget from "components/Widget";

const { confirm } = Modal;

const Option = Select.Option;


const SRMQBRScoreCard = (props) => {

  const { currentSupplier } = props;

  const { commodityId } = currentSupplier;

  const createModalRef = useRef(null);
  const editModalRef = useRef(null);

  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [handleEditModalLoading, setHandleEditModalLoading] = useState(false);
  const [quarterId, setQuarterId] = useState(null);
  const [editModalKey, setEditModalKey] = useState(0);

  const { data, loading, error } = useQuery(GET_QBR_SCORES, {
    variables: {
      data: {
        commodity_id: commodityId,
        quarter_id: quarterId
      }
    },
    fetchPolicy: "network-only",
  });

  const { data: quarters, loading: quarterLoading } = useQuery(GET_QUARTERS, {
    fetchPolicy: "network-only",
  });

  const onChangeQuarterId = async (id) => {
    setQuarterId(parseInt(id))
  }

  const mapDataToBarChart = (data) => {

    const steps = quarters?.getQuarters?.defaultTemplate?.steps?.map(({ name }) => name)

    if ( !steps?.length) {
      return null
    }

    data = JSON.parse(JSON.stringify(data.getQbrScores.qbrScore))

    let t = [
      ["Commodity"],
    ];

    for (let step of steps) {
      t[ 0 ].push(step)
    }
    const bars = [...t[ 0 ]];
    bars.shift()

    for (let item of data) {
      let arr = [item.name];

      for (let bar of bars) {
        arr.push(item.bars?.find(e => e.name == bar)?.contribution || 0)
      }

      t.push(arr)
    }

    return t;
  }

  const [removeQbrScore] = useMutation(REMOVE_QBR_SCORE)
  const [freezeQbrScore] = useMutation(FREEZE_QBR_SCORE)

  if (loading) return (
    <Row gutter={16}>
      <Col md={12}>
        <Widget className="dashboard-card-widget dashboard-card-min-h">
          <h1 className="dashboard-card-text">Loading QBR Scoring...</h1>
        </Widget>
      </Col>
    </Row>
  )
  if (error) return (
    <Row gutter={16}>
      <Col md={12}>
        <Widget className="dashboard-card-widget dashboard-card-min-h">
          <h1 className="dashboard-card-text">Error :(</h1>
        </Widget>
      </Col>
    </Row>
  );

  const onNewScore = () => {
    if ( !quarters?.getQuarters?.defaultTemplate?.id) {
      Modal.error({
        title: 'Error',
        content: 'Please select default template first!',
      });
      return
    }

    createModalRef.current.onAddScoreCard();
  }

  const onViewScore = () => {
    setIsViewModalVisible(true);
  }

  const handleViewModalCancel = () => {
    setIsViewModalVisible(false);
  }

  const onEditScore = () => {
    setIsEditModalVisible(true);
    setEditModalKey(editModalKey + 1)
  }

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
  }

  const deleteQbrScore = async () => {

    const supplierName = currentSupplier.name;
    const quarterName = data?.getQbrScores?.quarters
      ?.find(e => e.id === getQuarterId())
      ?.name;

    confirm({
      title: 'Are you sure?',
      icon: <ExclamationCircleOutlined/>,
      content: `This action will delete the scorecard for "${supplierName}" for quarter "${quarterName}"`,
      onOk() {
        return new Promise(async (resolve, reject) => {
          try {

            const { data: delData } = await removeQbrScore({
              variables: {
                data: {
                  commodity_id: commodityId,
                  organization_id: currentSupplier.id,
                  quarter_id: getQuarterId()
                }
              },
              refetchQueries: [GET_QBR_SCORES]
            });

            if ( !delData) throw new Error('Error')

            openNotification('success', 'Qbr Scoring deleted successfully');
            resolve()

          } catch (error) {
            resolve()
            console.log(error)
            openNotification('error', 'Error while deleting Qbr Scoring');
          }
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  const hasMenuHaveScoring = () => {
    if (data?.getQbrScores?.qbrScore?.length && currentSupplier?.id) {
      return data.getQbrScores.qbrScore
        .findIndex(e => e.organization_id == currentSupplier.id) > -1;
    }
    return false;
  }

  const hasMenuIsFreeze = () => {
    if (data?.getQbrScores?.qbrScore?.length && currentSupplier?.id) {
      const index = data.getQbrScores.qbrScore
        .findIndex(e => e.organization_id == currentSupplier.id);

      if (index > -1) {
        return data.getQbrScores.qbrScore[ index ]?.freeze;
      }
    }
    return false;
  }


  const handleEditModalSave = async () => {
    setHandleEditModalLoading(true)

    try {
      await editModalRef.current.handleSubmit()
      setIsEditModalVisible(false);
      setHandleEditModalLoading(false)

    } catch (e) {
      setHandleEditModalLoading(false)
    }

  }

  const getQuarterId = () => {
    return quarterId || data?.getQbrScores?.quarters?.[ 0 ]?.id
  }

  const onFreezeQbrScore = () => {

    const supplierName = currentSupplier.name;
    const quarterName = data?.getQbrScores?.quarters
      ?.find(e => e.id === getQuarterId())
      ?.name;

    confirm({
      title: 'Are you sure?',
      icon: <ExclamationCircleOutlined/>,
      content: `You are about to freeze the scorecard for supplier "${supplierName}" for quarter "${quarterName}"`,
      onOk() {
        return new Promise(async (resolve, reject) => {
          try {

            const { data } = await freezeQbrScore({
              variables: {
                data: {
                  commodity_id: commodityId,
                  organization_id: currentSupplier.id,
                  quarter_id: getQuarterId()
                }
              },
              refetchQueries: [GET_QBR_SCORES]
            });

            if (data.freezeQbrScore.hasError) throw new Error('Error')

            openNotification('success', `Thank you! Your scorecard for "${supplierName}" for quarter "${quarterName}" is submitted and frozen`);
            resolve()

          } catch (error) {
            resolve()
            console.log(error)
            openNotification('error', `Your scorecard for supplier "${supplierName}" for quarter "${quarterName}" has missing scores. Please click edit to complete the scoring before you can Freeze the scorecard. OK`);
          }
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  const menu = (
    <div className="qbr-score-card-actions">
      <img src={AddIcon} style={{ padding: "0 5px" }} onClick={onNewScore}/>

      {hasMenuHaveScoring() ? (
        <>
          <img src={ViewIcon} style={{ padding: "0 5px" }} onClick={onViewScore}/>
          {!hasMenuIsFreeze() ? (
            <>
              <img src={EditIcon} style={{ padding: "0 5px" }} onClick={onEditScore}/>
              <img src={DeleteIcon} style={{ padding: "0 5px" }} onClick={deleteQbrScore}/>
              <img src={FreezeIcon} style={{ padding: "0 5px" }} onClick={onFreezeQbrScore}/>
            </>
          ) : null}
        </>
      ) : null}

    </div>
  );

  return (
    <>
      { !quarterLoading && (
        <Row gutter={16}>
          <Col md={12}>
            <DashboardCard
              title="QBR Scoring"
              extraTopBar={<>
                {data?.getQbrScores?.quarters?.length ? (
                  <Select
                    showSearch
                    placeholder="Select a quarter"
                    style={{ marginRight: "4rem", width: "100px" }}
                    value={getQuarterId()}
                    onChange={onChangeQuarterId}
                  >
                    {data.getQbrScores.quarters?.map((option) => (
                      <Option key={option.id} value={option.id}>
                        {option.name}
                      </Option>
                    ))}
                  </Select>
                ) : null}

                {currentSupplier && (
                  <Dropdown overlay={menu} placement="bottom">
                    <a style={{ marginTop: "4px" }} onClick={e => e.preventDefault()}>
                      <DownOutlined/>
                    </a>
                  </Dropdown>
                )}

              </>}
              extra={
                data?.getQbrScores?.qbrScore?.length ?
                  <GradientChart key="qbr-scoring" data={mapDataToBarChart(data)}/> :
                  <h4>Not enough data</h4>
              }
            />
          </Col>
        </Row>
      )}

      {quarters?.getQuarters?.defaultTemplate?.id && (
        <CreateScoreModal
          key={Math.round(Math.random() * 10)}
          ref={createModalRef}
          selectedSupplier={currentSupplier}
          quarterId={getQuarterId()}
          data={quarters.getQuarters}
          commodityId={commodityId}
          organizationName={data?.getQbrScores?.organizationName}
        />
      )}

      {currentSupplier?.id && (
        <>
          <Modal
            onCancel={handleViewModalCancel}
            visible={isViewModalVisible}
            okButtonProps={{ hidden: true }}
            okText="Save"
            width={1200}
          >
            {isViewModalVisible && (
              <ViewScoreModal
                key={Math.round(Math.random() * 10)}
                quarters={quarters?.getQuarters?.quarters}
                selectedSupplier={currentSupplier}
                quarterId={getQuarterId()}
                commodityId={commodityId}
                organizationName={data?.getQbrScores?.organizationName}
              />
            )}
          </Modal>

          <Modal
            onOk={handleEditModalSave}
            confirmLoading={handleEditModalLoading}
            onCancel={handleEditModalCancel}
            visible={isEditModalVisible}
            okText="Save"
            width={1200}
          >
            {isEditModalVisible && (
              <EditScoreModal
                key={editModalKey}
                ref={editModalRef}
                quarters={quarters?.getQuarters?.quarters}
                selectedSupplier={currentSupplier}
                quarterId={getQuarterId()}
                commodityId={commodityId}
                organizationName={data?.getQbrScores?.organizationName}
              />
            )}
          </Modal>
        </>
      )}


    </>
  );
};


export default SRMQBRScoreCard;
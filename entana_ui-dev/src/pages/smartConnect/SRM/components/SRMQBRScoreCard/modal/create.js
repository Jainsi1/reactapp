import { Avatar, Col, Divider, Form, Input, Modal, Row, Select, Tooltip, Typography } from "antd";
import QBRTemplateEdit from "../QBRTemplateResponse/edit";
import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import openNotification from "utils/Notification";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_QBR_SCORE } from "../graphql/mutation";
import { GET_QBR_SCORES, GET_TRENDS } from "../graphql/query";
import QbrTrends from "../partials/trend";
import QbrSummary from "../partials/summary";

const Option = Select.Option;

const { TextArea } = Input;

const CreateScoreModal = forwardRef((props, ref) => {
  const { selectedSupplier, data: { quarters, defaultTemplate }, commodityId, quarterId, organizationName } = props;

  const [addForm] = Form.useForm();
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isScoreCardModalVisible, setScoreCardModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  //Todo recursive api calls
  const { data, loading, error, refetch } = useQuery(GET_TRENDS, {
    variables: {
      data: {
        commodity_id: commodityId,
        organization_id: selectedSupplier.id,
      }
    },
    fetchPolicy: "network-only",
  });

  useImperativeHandle(ref, () => ({
    onAddScoreCard() {
      setScoreCardModalVisible(true);
    },
    onAddRecord() {
      setAddModalVisible(true);
    }
  }));

  const createModalRef = useRef(null);

  const [scoreData, setScoreData] = useState({
    commodity_id: null,
    quarter_id: quarterId,
    organization_id: null,
    start_date: null,
    due_date: null,
    summary: null,
    responses: [],
  });

  const handleScoreCardCancel = () => {
    setScoreCardModalVisible(false);
  };

  const handleScoreCardSave = async () => {
    console.log("arha hun me")
    await refetch()
    setScoreCardModalVisible(false);
    setAddModalVisible(true);
  }

  const handleAddCancel = () => {
    setAddModalVisible(false);
  };

  const [addQbrScore] = useMutation(ADD_QBR_SCORE)

  const handleAddSave = async () => {
    setConfirmLoading(true);

    try {

      const responses = await createModalRef.current.getData();

      const finalData = {
        ...scoreData,
        commodity_id: parseInt(commodityId),
        organization_id: parseInt(selectedSupplier.id),
        responses
      }

      setScoreData(finalData);

      const { data } = await addQbrScore({
        variables: {
          data: finalData
        },
        refetchQueries: [GET_QBR_SCORES]
      });

      if ( !data) throw new Error('Error')

      setAddModalVisible(false);

      addForm.resetFields();

      setScoreData({
        commodity_id: null,
        quarter_id: null,
        organization_id: null,
        start_date: null,
        due_date: null,
        summary: null,
        responses: [],
      })

      createModalRef.current.resetData();

      openNotification('success', 'Qbr Scoring created successfully');

      setConfirmLoading(false);

    } catch (error) {
      setConfirmLoading(false);
      console.log(error)
      openNotification('error', 'Error while creating Qbr Scoring');
    }
  }

  return (
    <>
      <Modal
        title="Selected Supplier:"
        onOk={addForm.submit}
        onCancel={handleScoreCardCancel}
        visible={isScoreCardModalVisible}
        okText="Create New Scorecard"
      >
        <div>
          <h4>{selectedSupplier?.name}</h4>
        </div>
        <Form
          form={addForm}
          layout="vertical"
          name="form_in_modal"
          onFinish={handleScoreCardSave}
        >
          <Form.Item
            label="Initiate new QBR scoring for"
            name="quarter_id"
            initialValue={scoreData.quarter_id}
            rules={[
              {
                required: true,
                message: "Please Select Quarter",
              },
            ]}
          >
            <Select
              style={{ marginRight: "4rem" }}
              onChange={(event) => setScoreData({ ...scoreData, ...{ quarter_id: parseInt(event) } })}
            >
              {quarters.map((option) => (
                <Option key={option.id} value={option.id}>
                  {option.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Start Date"
            name="start_date"
            rules={[
              {
                required: true,
                message: "Please Select Start Date",
              },
            ]}
          >
            <Input
              type="date"
              value={scoreData.start_date}
              onChange={(event) => setScoreData({ ...scoreData, ...{ start_date: event.target.value } })}
            />
          </Form.Item>
          <Form.Item
            label="Due Date"
            name="due_date"
            rules={[
              {
                required: true,
                message: "Please Select Due Date",
              },
            ]}
          >
            <Input
              type="date"
              value={scoreData.due_date}
              onChange={(event) => setScoreData({ ...scoreData, ...{ due_date: event.target.value } })}
            />
          </Form.Item>
          <Form.Item
            label="Use Template (Default)"
          >
            <h4>{defaultTemplate.name}</h4>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        onOk={handleAddSave}
        confirmLoading={confirmLoading}
        onCancel={handleAddCancel}
        visible={isAddModalVisible}
        okText="Save"
        width={1200}
      >
        {isAddModalVisible ?
          <Row gutter={16} style={{ background: "white" }}>
            <Col xl={24}>
              <Row gutter={0}>
                <Col xl={8}/>
                <Col xl={8} className={"text-center"}>
                  <span className={"header-org-name"}>
                   {organizationName}
                  </span>
                  <span className={"header-supplier-performance"}>
                    SUPPLIER PERFORMANCE SCORECARD
                  </span>
                </Col>
                <Col xl={8} className={"text-right"}>
                  <div>
                    <span className={"header-date"}>Start Date</span>
                    <Input
                      type="date"
                      style={{ width: 130, height: 24 }}
                      value={scoreData.start_date}
                      onChange={(event) => setScoreData({ ...scoreData, ...{ start_date: event.target.value } })}
                    />
                  </div>
                  <div className={"mt-2"}>
                    <span className={"header-date"}>Due Date</span>
                    <Input
                      type="date"
                      style={{ width: 130, height: 24 }}
                      value={scoreData.due_date}
                      onChange={(event) => setScoreData({ ...scoreData, ...{ due_date: event.target.value } })}
                    />
                  </div>
                </Col>
              </Row>
            </Col>
            <Divider/>
            <Col xl={24}>
              <Row gutter={0}>
                <Col xl={8}/>
                <Col xl={8} className={"text-center"}>
                  <span className={"header-org-name"}>
                    For: {selectedSupplier.name?.toUpperCase()}
                  </span>
                </Col>
                <Col xl={8} className={"text-right"}>
                  <span className={"header-date"}>Timeframe</span>
                  <Select
                    style={{ width: 130, textAlign: "left" }}
                    value={scoreData.quarter_id}
                    onChange={(event) => setScoreData({ ...scoreData, ...{ quarter_id: parseInt(event) } })}
                  >
                    {quarters.map((option) => (
                      <Option key={option.id} value={option.id}>
                        {option.name}
                      </Option>
                    ))}
                  </Select>
                </Col>
              </Row>
            </Col>
            <Divider/>
            <Col md={12}>
              <QbrTrends
                title={"Quarterly Performance"}
                loading={loading}
                error={error}
                trends={data?.getTrends?.trends}
              />
            </Col>
            <Col md={12}>
              <QbrSummary
                title={"Summary"}
                loading={loading}
                error={error}
                trends={data?.getTrends?.trends}
              />
            </Col>
            <Col xl={24} style={{ marginTop: "10px" }}>
              <div className="qbr-score-card-widget">
                <QBRTemplateEdit
                  template={defaultTemplate}
                  ref={createModalRef}
                  isCreate={true}
                  stepPermissions={data?.getTrends.permissions}
                />
              </div>
            </Col>
          </Row>
          : null}
      </Modal>
    </>
  )
});

export default CreateScoreModal;
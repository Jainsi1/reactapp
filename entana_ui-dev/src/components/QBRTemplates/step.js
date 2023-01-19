import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Button, Col, Input, InputNumber, Row, Typography } from "antd";
import runValidation from "utils/validation";
import { DeleteOutlined } from "@ant-design/icons";
import openNotification from "../../utils/Notification";

const { Paragraph } = Typography
const QBRTemplateCreateStep = forwardRef((props, ref) => {
  const { id, stepName, display, updateStepName, onDeleteStep, canDelete, data = null } = props;

  const [stepData, setStepData] = useState(data ? data : {
    id: id,
    name: stepName,
    weightage: null,
    segments: [
      {
        name: null,
        weightage: null,
        questions: [
          { name: null },
        ]
      }
    ]
  });

  const [errors, setErrors] = useState({});

  const hasError = (key) => {
    return key in errors;
  }

  const rules = {
    "name": ['required'],
    "weightage": ['required'],
    "segments.*.name": ['required'],
    "segments.*.weightage": ['required'],
    "segments.*.questions.*.name": ['required'],
  }

  const onEditStepName = async (str) => {
    if ( !str?.trim()?.length) {
      return
    }
    setStepData(d => {
      d.name = str
      return d
    })
    await updateStepName(str, stepData)
  }

  const onlyNumber = (event) => {
    const ch = String.fromCharCode(event.which);
    if ( !/[0-9]/.test(ch)) {
      event.preventDefault();
    }
  }

  const getDummyData = () => {
    return JSON.parse(JSON.stringify(stepData));
  }

  const setData = (key, value) => {
    if (key.toLowerCase().includes("weightage")) value = isNaN(parseInt(value)) ? null : parseInt(value);

    if (key.includes(".")) {
      const keys = key.split(".");
      const [firstKey, firstIndex, secondKey, secondIndex, fourthKey] = keys;

      const dummyData = getDummyData();

      if (keys.length === 3) {
        dummyData[ firstKey ][ firstIndex ][ secondKey ] = value
      } else if (keys.length === 5) {
        dummyData[ firstKey ][ firstIndex ][ secondKey ][ secondIndex ][ fourthKey ] = value
      }

      setStepData({
        ...stepData,
        ...dummyData
      })

    } else {
      setStepData({
        ...stepData,
        [ key ]: value
      })
    }
  }


  useImperativeHandle(ref, () => ({
    validate() {
      return new Promise(function (myResolve, myReject) {
        setErrors({})
        console.log({ stepData })

        const errors = runValidation(stepData, rules);

        if (Object.keys(errors).length) {
          setErrors(errors)
          myReject("The given data in not valid")
        }

        if (validateWeightage(stepData.segments)) {
          openNotification('error', `The sum of ${stepData.name} segments weightage cannot be greater then 100%`);
          myReject("The given data in not valid")
          return
        }

        myResolve(stepData);
      });
    },
    getData() {
      return new Promise(function (myResolve, myReject) {
        myResolve(stepData);
      });
    },
  }));

  const validateWeightage = (segments) => {
    if (segments?.length) {
      const weightage = segments
        .map(f => f.weightage)
        .reduce((a, b) =>
          (isNaN(parseInt(a)) ? 0 : parseInt(a)) +
          (isNaN(parseInt(b)) ? 0 : parseInt(b))
        );
      return weightage > 100;
    }
  }

  const addSegment = () => {
    const dummyData = getDummyData();
    dummyData.segments.push({
      name: null,
      weightage: null,
      questions: [
        { name: null }
      ]
    })
    setStepData({
      ...dummyData
    })
  }

  const removeSegment = (index) => {
    if (stepData.segments.length <= 1) return
    const dummyData = getDummyData();
    dummyData.segments.splice(index, 1)
    setStepData({
      ...dummyData
    })
  }

  const addQuestion = (index) => {
    const dummyData = getDummyData();
    dummyData.segments[ index ].questions.push({ name: null })
    setStepData({
      ...dummyData
    })
  }

  const removeQuestion = (index, index2) => {
    if (stepData.segments[ index ].questions.length <= 1) return
    const dummyData = getDummyData();
    dummyData.segments[ index ].questions.splice(index2, 1)
    setStepData({
      ...dummyData
    })
  }

  return (
    <>
      <div className="steps-content" style={{ display: display ? "" : "none" }}>

        {canDelete && (
          <div style={{ position: "absolute", right: 11, top: 0 }}>
            <DeleteOutlined
              style={{ color: "red", cursor: "pointer" }}
              onClick={onDeleteStep}
            />
          </div>
        )}

        <Row gutter={16}>
          <Col xl={10}>
            <Typography.Title level={4} style={{ margin: 0 }}>
              <div style={{ display: "flex" }}>
                <Paragraph editable={{
                  onChange: onEditStepName,
                }}>
                  {stepData.name}
                </Paragraph>
                QUESTIONNAIRE
              </div>
              {hasError("name") ? <span className="error">{errors[ "name" ]}</span> : null}
            </Typography.Title>
            <p>Click on Add Segment button to add segment</p>
          </Col>
          <Col xl={10}>
            <div className="weightage-flex" style={{ justifyContent: "left" }}>
              <p className="text-bold">
                Weightage
              </p>
              <div>
                <InputNumber
                  min={1} max={100}
                  style={{
                    width: '92px',
                  }}
                  value={stepData.weightage}
                  onKeyPress={onlyNumber}
                  onChange={(event) => setData("weightage", event)}
                  placeholder="Weightage"
                />
                {hasError("weightage") ? <span className="error">{errors[ "weightage" ]}</span> : null}
              </div>
            </div>
          </Col>
          <Col xl={4} style={{ textAlign: "right" }}>
            <Button type="primary" onClick={addSegment}>
              Add Segment
            </Button>
          </Col>
        </Row>
        {stepData.segments.map((segment, i) =>
          <div key={i}>
            <Row gutter={16} style={{ marginTop: "20px" }}>
              <Col xl={12}>
                <Input
                  placeholder="Enter Segment name"
                  value={segment.name}
                  onChange={(event) => setData(`segments.${i}.name`, event.target.value)}
                />
                {hasError(`segments.${i}.name`) ?
                  <span className="error">{errors[ `segments.${i}.name` ]}</span> : null}
              </Col>
              <Col xl={6}>
                <div className="weightage-flex">
                  <p className="text-bold">
                    Segment Weightage
                  </p>
                  <InputNumber
                    min={0} max={100}
                    style={{
                      width: '92px',
                    }}
                    value={segment.weightage}
                    onChange={(event) => setData(`segments.${i}.weightage`, event)}
                    placeholder="Weightage"
                  />
                </div>
                {hasError(`segments.${i}.weightage`) ?
                  <p className="error"
                     style={{ textAlign: "right" }}>{errors[ `segments.${i}.weightage` ]}</p> : null}
              </Col>
              <Col xl={6} style={{ textAlign: "right" }}>
                <Button
                  className="ant-btn ant-btn-dangerous margin"
                  onClick={() => removeSegment(i)}
                >
                  Delete
                </Button>
                <Button type="primary" onClick={() => addQuestion(i)}>
                  Add Questions
                </Button>
              </Col>
            </Row>
            {segment.questions.map((question, i2) =>
              <Row gutter={16} key={i2} style={{ marginTop: "20px" }}>
                <Col xl={18}>
                  <div className="weightage-flex">
                    <p className="text-bold">
                      Question
                    </p>
                    <Input
                      placeholder="Enter your question here"
                      value={question.name}
                      onChange={(event) => setData(`segments.${i}.questions.${i2}.name`, event.target.value)}
                    />
                  </div>
                  {hasError(`segments.${i}.questions.${i2}.name`) ?
                    <span className="error"
                          style={{ marginLeft: "5rem" }}>{errors[ `segments.${i}.questions.${i2}.name` ]}</span> : null}
                </Col>
                <Col xl={6}>
                  <Button
                    className="ant-btn ant-btn-dangerous margin ml-4"
                    onClick={() => removeQuestion(i, i2)}
                  >
                    Delete
                  </Button>
                </Col>
              </Row>
            )}
          </div>
        )}
      </div>
    </>
  )
});

export default QBRTemplateCreateStep;
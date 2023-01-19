import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Col, Input, InputNumber, Row, Typography } from "antd";
import './style.css';
import { collect } from "collect.js";

const QBRTemplateCreateStep = forwardRef((props, ref) => {
  const { stepName, display, data = null, isReadonly = false, isCreate = false } = props;

  const [scoreBar, setScoreBar] = useState(props.bar || { score: 0, contribution: 0 });

  const [stepData, setStepData] = useState(data ? data : {
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

  const getDummyData = () => {
    return JSON.parse(JSON.stringify(stepData));
  }

  const setData = (key, value) => {
    if (key.toLowerCase().includes("weightage")) value = isNaN(parseInt(value)) ? null : parseInt(value);

    let data = {};

    if (key.includes(".")) {
      const keys = key.split(".");
      const [firstKey, firstIndex, secondKey, secondIndex, fourthKey] = keys;

      const dummyData = getDummyData();

      if (keys.length === 3) {
        dummyData[ firstKey ][ firstIndex ][ secondKey ] = value
      } else if (keys.length === 5) {
        dummyData[ firstKey ][ firstIndex ][ secondKey ][ secondIndex ][ fourthKey ] = value
      }

      setStepData((prevData) => {
        return data = {
          ...prevData,
          ...dummyData
        }
      })

    } else {
      setStepData((prevData) => {
        return data = {
          ...prevData,
          [ key ]: value
        };
      })
    }

    if (key.toLowerCase().includes("score")) {
      updateScores(data);
    }
  }

  const updateScores = (data) => {
    let score = 0;

    for (let segment of data.segments) {
      let newScore = 0;

      const avgQuestionWeightage = collect(segment.questions)
        .avg('score')
        .toFixed();

      newScore = Math.round(parseInt(avgQuestionWeightage) * segment.weightage / 100);

      score += parseIt(newScore);
    }

    if (score === 0) return;

    setScoreBar({
      score,
      contribution: Math.round(data.weightage * score / 100)
    })
  }

  const parseIt = (value) => {
    return isNaN(value) ? 0 : value;
  }

  useImperativeHandle(ref, () => ({
    validate() {
      return new Promise(function (myResolve) {
        myResolve(stepData);
      });
    },
    reset() {
      setStepData(data);
    }
  }));

  return (
    <>
      <div className="qbr-steps-content" style={{ display: display ? "" : "none" }}>
        <Row gutter={16}>
          <Col xl={8}>
            <Typography.Title
              level={5}
              style={{ margin: 0, width: 220 }}
              ellipsis={{ tooltip: `${stepName} QUESTIONNAIRE` }}
            >
              {stepName} QUESTIONNAIRE
            </Typography.Title>
          </Col>
          <Col xl={5}>
            <div className="weightage-flex" style={{ justifyContent: "left" }}>
              <p className="text-bold">
                Weightage
              </p>
              <div>
                <p className="text-bold">
                  {stepData.weightage}%
                </p>
              </div>
            </div>
          </Col>
          <Col xl={5}>
            <div className="weightage-flex" style={{ justifyContent: "left" }}>
              <p className="text-bold">
                Score
              </p>
              <div>
                <p className="text-bold">
                  {scoreBar?.score}%
                </p>
              </div>
            </div>
          </Col>
          <Col xl={5}>
            <div className="weightage-flex" style={{ justifyContent: "left" }}>
              <p className="text-bold">
                Contribution
              </p>
              <div>
                <p className="text-bold">
                  {scoreBar.contribution}%
                </p>
              </div>
            </div>
          </Col>
        </Row>
        {stepData.segments.map((segment, i) =>
          <div key={i}>
            <Row gutter={16} style={{ marginTop: "10px" }}>
              <Col xl={12}>
                <Typography.Title level={4} style={{ margin: 0 }}>
                  {segment.name}
                </Typography.Title>
              </Col>
              <Col xl={8}>
                <div className="weightage-flex">
                  <p className="text-bold">
                    Segment Weightage
                  </p>
                  <p className="text-bold">
                    {segment.weightage}%
                  </p>
                </div>
              </Col>
            </Row>
            {segment.questions.map((question, i2) =>
              <div key={i2}>
                <Row gutter={16} style={{ marginTop: "10px" }}>
                  <Col xl={3}>
                    <p className="text-bold">
                      Question
                    </p>
                  </Col>
                  <Col xl={12}>
                    <p>
                      {question.name}
                    </p>
                  </Col>
                  <Col xl={6}>
                    <InputNumber
                      placeholder="0 - 100%"
                      min={0} max={100}
                      value={question.score}
                      disabled={isReadonly}
                      onChange={(event) => setData(`segments.${i}.questions.${i2}.score`, event)}
                    />
                  </Col>
                </Row>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
});

export default QBRTemplateCreateStep;

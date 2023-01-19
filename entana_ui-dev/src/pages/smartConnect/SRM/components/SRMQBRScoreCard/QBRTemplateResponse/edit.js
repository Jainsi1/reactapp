import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Col, Row, Steps, Typography } from 'antd';
import './style.css'
import QBRTemplateCreateStep from "./step";
import { LeftCircleOutlined, RightCircleOutlined } from "@ant-design/icons";

const { Step } = Steps;

const QBRTemplateEdit = forwardRef((props, newRef) => {
  const {
    template: templateData,
    isCreate = false,
    responses = null,
    bars = null,
    stepPermissions = []
  } = props;

  const steps = templateData.steps.map(({ id, name }) => {
    return { id, title: name }
  })
  console.log({ steps, stepPermissions })

  //TODO need to refactor this logic Error: Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks
  const refs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ]

  const [current, setCurrent] = useState(0);

  const mapData = (data) => {
    if (data?.steps?.length) {
      data.steps = data.steps.map(step => {
        if (step?.segments?.length) {
          step.segments = step.segments.map(s => {
            if (s?.questions?.length) {
              s.questions = s.questions.map(q => {
                const responseData = responses?.find(e => e.qbr_template_step_segment_question_id == q.id);

                const response = {
                  response: responseData?.response,
                  details: responseData?.details,
                  score: responseData?.weightage,
                }

                return {
                  ...q,
                  ...response
                };
              })
            }
            return s;
          })
        }

        return step
      })
    }

    return data
  }

  const [template, setTemplate] = useState({ ...mapData(templateData) });

  useImperativeHandle(newRef, () => ({
    resetData() {
      setCurrent(0);
      setTemplate(mapData(templateData))
      for (let i in steps) {
        refs[ i ].current.reset();
      }
    },
    getData() {
      return new Promise(async function (resolve, reject) {
        try {
          const templateSteps = [];

          for (let stepIndex in steps) {
            const data = await refs[ stepIndex ].current.validate();
            templateSteps.push(data)
          }

          const finalData = {
            ...template,
            ...{ steps: templateSteps }
          }
          setTemplate(finalData)

          const questions = [];

          finalData.steps?.forEach(step => {
            step?.segments?.forEach(segment => {
              segment?.questions?.forEach(question => {
                questions.push({
                  question_id: question.id,
                  response: question.response,
                  weightage: question.score,
                  details: question.details
                })
              })
            })
          })

          resolve(questions);
        } catch (e) {
          reject(e)
        }

      })
    }
  }));

  const setCurrentStep = (i) => {
    setCurrent(i);
  }

  const next = async () => {
    setCurrent(current + 1)
  };

  const prev = () => {
    setCurrent(current - 1);
  };


  return (
    <>
      <Row gutter={16}>
        <Col xs={1} md={1} xl={1}>
          {current > 0 && (
            <LeftCircleOutlined
              onClick={() => prev()}
              className="action-arrow"
            />
          )}
        </Col>
        <Col xs={22} md={22} xl={22} className="qbr-score-details">
          <Typography.Title level={3} center style={{ margin: 0, textAlign: "center" }}>
            QBR Scoring Details
          </Typography.Title>

          <Steps
            current={current}
            style={{
              marginTop: '20px',
            }}>
            {steps.map((item, i) => (
              <Step
                key={item.title}
                title={item.title}
                style={{ cursor: "pointer" }}
                onClick={() => setCurrentStep(i)}
              />
            ))}
          </Steps>
          {steps.map((item, i) => (
            <QBRTemplateCreateStep
              data={template?.steps?.find(e => e.id == item.id)}
              bar={bars?.find(e => e.name == item.title)}
              key={item.title}
              stepName={item.title}
              ref={refs[ i ]}
              display={i == current}
              isCreate={isCreate}
              isReadonly={stepPermissions.indexOf(item.id) === -1}
            />
          ))}
        </Col>
        <Col xs={1} md={1} xl={1}>
          {current < steps.length - 1 && (
            <RightCircleOutlined
              onClick={() => next()}
              className="action-arrow"
            />
          )}
        </Col>
      </Row>
    </>
  );
});

export default QBRTemplateEdit;

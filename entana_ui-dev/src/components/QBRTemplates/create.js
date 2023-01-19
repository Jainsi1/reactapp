import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Input, Popover, Row, Select, Steps, Typography } from 'antd';
import './qbr-templates.css'
import QBRTemplateCreateStep from "./step";
import runValidation from "utils/validation";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_QBR_TEMPLATE } from "./graphql/Mutation";
import openNotification from "utils/Notification";

const Option = Select.Option;

const { Step } = Steps;

const QBRTemplateCreate = (props) => {
  const { onAdd: onAdded, commodities } = props;

  const [current, setCurrent] = useState(0);
  const [disabledBtn, setDisabledBtn] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [steps, setSteps] = useState([
    {
      id: 1,
      title: 'Pillar 1'
    },
  ]);

  const [template, setTemplate] = useState({
    name: null,
    commodity_ids: [parseInt(commodities[ 0 ]?.id)],
    steps: []
  });

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

  const [errors, setErrors] = useState({});

  const hasError = (key) => {
    return key in errors;
  }

  const rules = {
    "name": ['required'],
    "commodity_ids": ['required']
  }

  const onCommodityChange = (event) => {
    if (event.length === 0) return;

    setTemplate({ ...template, ...{ commodity_ids: event.map(e => parseInt(e)) } })
  }
  const getMaxStepId = () => {
    return Math.max(...steps.map(({ id }) => id))
  }

  const onAddPillar = async () => {
    await backupStepData()
    setSteps(old => {
      old.push({
        id: getMaxStepId() + 1,
        title: "Pillar " + (steps.length + 1),
      })
      return old
    })
    refreshSteps()
  }

  const refreshSteps = () => {
    setRefresh(() => {
      return true
    })
    setRefresh(() => {
      return false
    })
  }

  const backupStepData = async () => {
    const temTemplateSteps = [...template.steps];

    for (let i in steps) {
      const data = await refs[ current ].current.getData();

      const templateStepIndex = temTemplateSteps.findIndex(e => e.id == data.id);

      if (templateStepIndex > -1) {
        temTemplateSteps[ templateStepIndex ] = data;
      } else {
        temTemplateSteps.push(data)
      }
    }

    const finalData = {
      ...template,
      ...{ steps: temTemplateSteps }
    }

    setTemplate(finalData)

  }

  const updateStepName = async (i, name, data) => {
    const temTemplateSteps = [...template.steps];

    temTemplateSteps[ i ] = data;

    const finalData = {
      ...template,
      ...{ steps: temTemplateSteps }
    }

    console.log({ finalData })

    setTemplate(finalData)

    setSteps(old => {
      old[ i ].title = name
      return old
    })

    refreshSteps()
  }

  const deleteStep = (i) => {
    const temTemplateSteps = [...template.steps];

    temTemplateSteps.splice(i, 1);

    const finalData = {
      ...template,
      ...{ steps: temTemplateSteps }
    }

    setTemplate(finalData)

    setSteps(old => {
      old.splice(i, 1);

      return old
    })

    refreshSteps()
  }

  const next = async () => {
    setDisabledBtn(true)

    try {
      await validateTemplateName();

      const data = await refs[ current ].current.validate();

      const temTemplateSteps = [...template.steps];

      const templateStepIndex = temTemplateSteps.findIndex(e => e.name == data.name);

      if (templateStepIndex > -1) {
        temTemplateSteps[ templateStepIndex ] = data;
      } else {
        temTemplateSteps.push(data)
      }

      const finalData = {
        ...template,
        ...{ steps: temTemplateSteps }
      }

      setTemplate(finalData)

      if (current === steps.length - 1) await submitData(finalData);
      else
        setCurrent(current + 1)

    } catch (e) {
      console.log(e)
    }

    setDisabledBtn(false)
  };

  const [addQbrTemplate] = useMutation(ADD_QBR_TEMPLATE)

  const submitData = async (finalData) => {

    if (validateWeightage(finalData)) {
      openNotification('error', 'The sum of all steps weightage cannot be greater then 100%');
      return
    }

    try {

      const { data } = await addQbrTemplate({
        variables: {
          data: finalData
        }
      });

      if ( !data) throw new Error('Error')

      openNotification('success', 'Qbr Template created successfully');

      onAdded()

      setTemplate({
        name: null,
        commodity_ids: [parseInt(commodities[ 0 ]?.id)],
        steps: []
      })

    } catch (error) {
      console.log(error)
      openNotification('error', 'Error while creating Qbr Template');
    }
  }

  const validateWeightage = (finalData) => {
    if (finalData?.steps?.length) {
      const weightage = finalData?.steps
        .map(f => f.weightage)
        .reduce((a, b) =>
          (isNaN(parseInt(a)) ? 0 : parseInt(a)) +
          (isNaN(parseInt(b)) ? 0 : parseInt(b))
        );
      return weightage > 100;
    }
  }

  const validateTemplateName = async () => {
    return new Promise(function (resolve, reject) {
      if (current == 0) {

        setErrors({});

        const errors = runValidation(template, rules);

        if (Object.keys(errors).length) {
          setErrors(errors)
          reject('The given data in not valid');
        }

        resolve();
      }
      resolve();
    })
  }

  const prev = () => {
    setCurrent(current - 1);
  };

  return (
    <>
      <Button type="primary" onClick={() => onAdded()}>
        Back
      </Button>
      <Row gutter={16}>
        <Col xs={24} md={24} xl={24}>
          <Typography.Title level={3} center style={{ margin: 0, textAlign: "center" }}>
            Create New QBR Template
          </Typography.Title>

          <Row gutter={16} style={{ marginTop: '20px' }}>
            <Col xl={6}>
              <Input
                value={template.name}
                onChange={(event) => setTemplate({ ...template, ...{ name: event.target.value } })}
                placeholder="Template name"
              />
              {hasError("name") ? <div className="error">{errors[ "name" ]}</div> : null}
            </Col>

            <Col xl={6}>
              {commodities && (
                <Select
                  mode="multiple"
                  maxTagTextLength={3}
                  maxTagCount={1}
                  placeholder="Please select a commodity"
                  onChange={onCommodityChange}
                  //   defaultValue={options[0].id}
                  className="w-32 commodity-selector"
                  value={template.commodity_ids.map(e => e.toString())}
                >
                  {commodities?.map((option) => (
                    <Option key={option.id} value={option.id}>
                      {option.name}
                    </Option>
                  ))}}
                </Select>
              )}
              {hasError("commodity_ids") ? <div className="error">{errors[ "commodity_ids" ]}</div> : null}
            </Col>
            <Col xl={6}>
              <Button type="primary" onClick={onAddPillar}>
                Add Pillar
              </Button>
            </Col>
          </Row>

          <Steps
            current={current}
            style={{
              marginTop: '20px',
            }}>
            { !refresh && steps.map((item, i) => (
              <Step
                key={item.id}
                title={item.title}
              />
            ))}
          </Steps>
          { !refresh && steps.map((item, i) => (
            <QBRTemplateCreateStep
              id={item.id}
              key={item.id}
              stepName={item.title}
              ref={refs[ i ]}
              display={i == current}
              data={template?.steps?.find(e => e.id == item.id)}
              updateStepName={(...props) => updateStepName(i, ...props)}
              onDeleteStep={() => deleteStep(i)}
            />
          ))}
          <div className="steps-action">
            {current > 0 && (
              <Button style={{ margin: '0 8px' }} disabled={disabledBtn} onClick={() => prev()}>
                Previous
              </Button>
            )}
            {current < steps.length - 1 && (
              <Button type="primary" disabled={disabledBtn} onClick={() => next()}>
                Next
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button type="primary" disabled={disabledBtn} onClick={() => next()}>
                Done
              </Button>
            )}
          </div>

        </Col>
      </Row>
    </>
  );
};

export default QBRTemplateCreate;

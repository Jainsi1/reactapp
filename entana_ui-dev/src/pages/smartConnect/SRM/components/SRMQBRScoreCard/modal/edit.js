import { Col, Divider, Row } from "antd";
import QBRTemplateEdit from "../QBRTemplateResponse/edit";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import openNotification from "utils/Notification";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_QBR_SCORE } from "../graphql/mutation";
import { GET_QBR_SCORE, GET_QBR_SCORES } from "../graphql/query";
import moment from "moment";
import QbrTrends from "../partials/trend";
import QbrSummary from "../partials/summary";

const EditScoreModal = forwardRef((props, ref) => {
  const { selectedSupplier, quarterId, commodityId, quarters, organizationName } = props;

  const { data, loading, error } = useQuery(GET_QBR_SCORE, {
    variables: {
      data: {
        commodity_id: commodityId,
        organization_id: selectedSupplier.id,
        quarter_id: quarterId
      }
    },
    fetchPolicy: "network-only",
  });

  const [scoreData, setScoreData] = useState({});
  const [qbrLoading, setQbrLoading] = useState(true);

  useEffect(() => {
    if ( !!data && !loading && !error) {
      setScoreData({
        ...data.getQbrScore.qbrScore,
        responses: data.getQbrScore.qbrScore?.responses.map(m => {
          return {
            question_id: m.qbr_template_step_segment_question_id,
            response: m.response,
            details: m.details,
            weightage: m.weightage,
          }
        }) || [],
      });
    }
    if ( !loading && !error)
      setQbrLoading(false)
  }, [data, loading, error]);

  const [updateQbrScore] = useMutation(UPDATE_QBR_SCORE)

  const createModalRef = useRef(null);

  const removeAllTypenamesNoMutate = (item) => {
    if ( !item) return;

    const recurse = (source, obj) => {
      if ( !source) return;

      if (Array.isArray(source)) {
        for (let i = 0; i < source.length; i++) {
          const item = source[ i ];
          if (item !== undefined && item !== null) {
            source[ i ] = recurse(item, item);
          }
        }
        return obj;
      } else if (typeof source === 'object') {
        for (const key in source) {
          if (key === '__typename' || key == 'approvedUserName') continue;
          const property = source[ key ];
          if (Array.isArray(property)) {
            obj[ key ] = recurse(property, property);
          } else if ( !!property && typeof property === 'object') {
            const { __typename, ...rest } = property;
            obj[ key ] = recurse(rest, rest);
          } else {
            obj[ key ] = property;
          }
        }
        const { __typename, ...rest } = obj;

        return rest;
      } else {
        return obj;
      }
    };

    return recurse(JSON.parse(JSON.stringify(item)), {});
  };

  useImperativeHandle(ref, () => ({
    async handleSubmit() {
      return new Promise(async function (resolve, reject) {
        try {

          const responses = await createModalRef.current.getData();
          console.log(responses)

          let finalData = {
            ...scoreData,
            quarter_id: quarterId,
            commodity_id: parseInt(commodityId),
            organization_id: parseInt(selectedSupplier.id),
            responses
          }

          setScoreData(removeAllTypenamesNoMutate(finalData));

          finalData = {
            ...finalData,
            start_date: moment(scoreData.start_date).format('YYYY-MM-DD'),
            due_date: moment(scoreData.due_date).format('YYYY-MM-DD'),
          }

          delete finalData.id;
          delete finalData.bars;

          const { data } = await updateQbrScore({
            variables: {
              data: removeAllTypenamesNoMutate(finalData),
              where: {
                id: scoreData.id
              }
            },
            refetchQueries: [GET_QBR_SCORES, GET_QBR_SCORE]
          });

          if ( !data) throw new Error('Error')

          openNotification('success', 'Qbr Scoring updated successfully');
          resolve();

        } catch (error) {
          reject(error);
          console.log(error)
          openNotification('error', 'Error while updating Qbr Scoring');
        }
      })
    }
  }));

  const getSelectedQuarter = () => {
    const index = quarters?.findIndex(e => e.id == quarterId);
    if (index > -1) return quarters[ index ].name;
    return "";
  }

  if (qbrLoading || loading) return <p className="tw-text-center">Loading QBR Scoring...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <>
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
                {moment(scoreData.start_date).format('YYYY-MM-DD')}
              </div>
              <div className={"mt-2"}>
                <span className={"header-date"}>Due Date</span>
                {moment(scoreData.due_date).format('YYYY-MM-DD')}
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
              {getSelectedQuarter()}
            </Col>
          </Row>
        </Col>
        <Divider/>
        <Col md={12}>
          <QbrTrends
            title={"Quarterly Performance"}
            loading={false}
            error={null}
            trends={data?.getQbrScore.trends}
          />
        </Col>
        <Col md={12}>
          <QbrSummary
            title={"Summary"}
            loading={false}
            error={null}
            trends={data?.getQbrScore.trends}
          />
        </Col>
        <Col xl={24} style={{ marginTop: "10px" }}>
          <div className="qbr-score-card-widget">
            <QBRTemplateEdit
              ref={createModalRef}
              template={data.getQbrScore.qbrTemplate}
              responses={data.getQbrScore.qbrScore.responses}
              bars={data.getQbrScore?.qbrScore?.bars}
              stepPermissions={data.getQbrScore?.permissions}
            />
          </div>
        </Col>
      </Row>
    </>
  )
});

export default EditScoreModal;
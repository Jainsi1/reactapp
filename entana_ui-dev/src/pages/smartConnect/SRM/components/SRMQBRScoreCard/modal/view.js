import { Col, Divider, Row } from "antd";
import React, { forwardRef, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_QBR_SCORE } from "../graphql/query";
import moment from "moment";
import QBRTemplateView from "../QBRTemplateResponse/view";
import QbrTrends from "../partials/trend";
import QbrSummary from "../partials/summary";

const ViewScoreModal = forwardRef((props, ref) => {
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

  const [qbrLoading, setQbrLoading] = useState(true);

  const [scoreData, setScoreData] = useState({});

  useEffect(() => {
    if ( !!data && !loading && !error) {
      setScoreData(data.getQbrScore.qbrScore);
    }
    if ( !loading && !error)
      setQbrLoading(false)
  }, [data, loading, error]);

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
            <Col xl={8}>
              {data?.getQbrScore?.qbrScore?.approvedUserName && (
                <>
                  <span className={"header-date"}>Approved By:</span><span
                  className={"text-bold"}>{data.getQbrScore.qbrScore.approvedUserName}</span>
                </>
              )}
            </Col>
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
            <QBRTemplateView
              template={data.getQbrScore.qbrTemplate}
              responses={scoreData.responses}
              bars={scoreData.bars}
            />
          </div>
        </Col>
      </Row>
    </>
  )
});

export default ViewScoreModal;
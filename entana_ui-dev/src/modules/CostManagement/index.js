import React from "react";
import { Row, Col, Select, Table } from "antd";
import "./costManagement.css";
import PieChart from "components/Chart/PieChart";
import PageHeader from "components/PageHeader";
import piggyBank from "assets/images/piggy-bank.svg";
import dollarHand from "assets/images/dollar-hand.svg";
import DashboardCard from "components/DashboardCard/index";
import LineChart from "components/Chart/LineChart";
import { DoubleData, DoubleOptions } from "components/Chart/LineChart/data";
import { CheckCircleFilled } from "@ant-design/icons";
import {
  costTableText,
  costTableTextRed,
  costTableTextGreen,
} from "utils/table";

import ConstActionsTable from "components/ActionsTable/constActionTable";

import { FaExpandAlt } from "react-icons/fa";

export const ConstNegotiationColumns = [
  {
    title: "",
    dataIndex: "companyName",
    render: costTableText,
  },
  {
    title: `FQ2’21`,
    dataIndex: "quarter1",
    render: costTableTextRed,
  },
  {
    title: `FQ3’21`,
    dataIndex: "quarter2",
    render: costTableTextRed,
  },
  {
    title: `FQ4’21`,
    dataIndex: "quarter3",
    render: costTableTextGreen,
  },
  {
    title: `FQ1’22 Target`,
    dataIndex: "Target",
    render: costTableTextGreen,
  },
  {
    title: `FQ2’22 Submission`,
    dataIndex: "Submission",
    render: costTableTextGreen,
  },
  {
    title: "",
    dataIndex: "actions",
    render: (text, record) => <ConstActionsTable text={text} record={record} />,
    width: "86px",
  },
];

export const ConstNegotiationData = [
  {
    key: "1",
    companyName: "Samsung",
    quarter1: "5%",
    quarter2: "0%",
    quarter3: "5%",
    Target: "10%",
    Submission: "12%",
  },
  {
    key: "2",
    companyName: "Kioxia",
    quarter1: "5%",
    quarter2: "1%",
    quarter3: "5%",
    Target: "8%",
    Submission: "12%",
  },
  {
    key: "3",
    companyName: "Solidigm",
    quarter1: "2%",
    quarter2: "2%",
    quarter3: "3%",
    Target: "5%",
    Submission: "7%",
  },
  {
    key: "3",
    companyName: "Hynix",
    quarter1: "3%",
    quarter2: "0%",
    quarter3: "4%",
    Target: "9%",
    Submission: "6%",
  },
  {
    key: "3",
    companyName: "Micron",
    quarter1: "8%",
    quarter2: "4%",
    quarter3: "2%",
    Target: "7%",
    Submission: "8%",
  },
];



const Option = Select.Option;

function CostManagement() {
  return (
    <>
      <PageHeader title="CostIQ" />

      <Row gutter={16}>
        <Col xs={24} md={6} xl={6}>
          <DashboardCard
            title="Cost Saving"
            isUp
            hasToolTip
            toolTip="QoQ gross cost change for the commodity selected"
            mainValue="$ 90M"
            subValue="$ 60M"
            extraTopBar={
              <a href="#">
                <FaExpandAlt className="expand-alt" />
              </a>
            }
            extra={<PieChart />}
          />
        </Col>
        <Col xs={24} md={6} xl={6}>
          <DashboardCard
            title="Riscometer"
            hasToolTip
            toolTip="Simulated savings risk/opportunity recommendation by AI engine"
            extraTopBar={
              <a href="#">
                <FaExpandAlt className="expand-alt" />
              </a>
            }
            extra={
              <>
                <Row className="riscometer-piggybank-row">
                  <Col>
                    <div className="piggy-image">
                      <img src={piggyBank} alt="piggy bank" />
                    </div>
                  </Col>
                  <Col className="piggy-bank-text">
                    <span className="piggy-text-half">
                      <b>$2M</b> SAVING
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="dollar-image">
                      <img src={dollarHand} alt="piggy bank" />
                    </div>
                  </Col>
                  <Col className="dollar-text">
                    <span className="dollar-text-half">
                      <b>$100M</b> SPEND
                    </span>
                  </Col>
                </Row>
                <div>
                  <p className="riscometer-paragraph-text">
                    <span className="riscometer-paragraph">Ant AI engine</span>{" "}
                    has identified $2M{" "}
                    <span className="riscometer-paragraph">
                      savings opportunities
                    </span>
                    and $100M{" "}
                    <span className="riscometer-paragraph">spend risk</span> to
                    be mitigaged.
                  </p>
                </div>
              </>
            }
          />
        </Col>
        <Col xs={24} md={12} xl={12}>
          <DashboardCard
            title="Spend Map"
            hasToolTip
            toolTip="Comparison of commodity cost with selected analyst"
            extraTopBar={
              <>
                <div className="dashboard-dropdown">
                  <Select size="small" placeholder="Enterprise SSD">
                    <Option value="china">China</Option>
                    <Option value="usa">U.S.A</Option>
                  </Select>
                </div>
                <div>
                  <Select size="small" placeholder="Enterprise SSD">
                    <Option value="china">China</Option>
                    <Option value="usa">U.S.A</Option>
                  </Select>
                </div>
              </>
            }
            extra={
              <LineChart
                chartType="LineChart"
                data={DoubleData}
                options={DoubleOptions}
              />
            }
          />
        </Col>
      </Row>

      <Row gutter={16} className="cost-management-bottom-card">
        <Col md={12} xs={24} xl={12}>
          <DashboardCard
            title="ANT AI Engine Insights"
            hasToolTip
            toolTip="AI engine generated cost negotiation transcript"
            extraTopBar={
              <a href="#">
                <FaExpandAlt className="expand-alt" />
              </a>
            }
            extra={
              <>
                <Row className="engine-insights-card">
                  <Col span={1}>
                    <CheckCircleFilled className="check-icon" />
                  </Col>
                  <Col span={23}>
                    <span className="engine-card-text">
                      Wells Fargo expects semiconductor market to remain soft in
                      2022 driven by COVID lockdowns across major economies.
                    </span>
                  </Col>
                </Row>
                <Row className="engine-insights-card">
                  <Col span={1}>
                    <CheckCircleFilled className="check-icon" />
                  </Col>
                  <Col span={23}>
                    <span className="engine-card-text">
                      NAND Spot prices are expected to fall this quarter as
                      well. Forward Insights projects overall 7% deflation and
                      strongest on PCIe portfolio as suppliers want to
                      agreesively consolidate the demand among interfaces and
                      are removing cost barries for the adoption.
                    </span>
                  </Col>
                </Row>
                <Row className="engine-insights-card">
                  <Col span={1}>
                    <CheckCircleFilled className="check-icon" />
                  </Col>
                  <Col span={23}>
                    <span className="engine-card-text">
                      Samsung expects increased sales of high-density server
                      SSDs and share of 128-layer V-NAND
                    </span>
                  </Col>
                </Row>
                <Row className="engine-insights-card">
                  <Col span={1}>
                    <CheckCircleFilled className="check-icon" />
                  </Col>
                  <Col span={23}>
                    <span className="engine-card-text">
                      Samsung projects NAND under stable supply by leveraging
                      SCM capabilities, maintain differentiation by expanding
                      portion of high-value products{" "}
                    </span>
                  </Col>
                </Row>
              </>
            }
          />
        </Col>
        <Col md={12} xs={24} xl={12}>
          <DashboardCard
            title="Cost Negotiation"
            extraTopBar={
              <a href="#">
                <FaExpandAlt className="expand-alt" />
              </a>
            }
            hasToolTip
            toolTip="Historical cost inflation/deflation trend and current quarter cost change information"
            extra={
              <Table
                columns={ConstNegotiationColumns}
                dataSource={ConstNegotiationData}
                size="middle"
                scroll={{ x: true }}
              />
            }
          />
        </Col>
      </Row>
    </>
  );
}

export default CostManagement;

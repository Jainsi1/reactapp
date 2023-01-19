import React from "react";
import { Row, Col, Divider } from "antd";

import { FaInfoCircle } from "react-icons/fa";

import "./dashboardCard.css";
import Widget from "components/Widget";

import greenArrow from "assets/images/up-arrow.svg";
import redArrow from "assets/images/redArrow.svg";

const DashboardCard = ({
  title,
  hasToolTip = false,
  toolTip,
  mainValue,
  subValue,
  isUp = false,
  extra,
  extraTopBar,
  minHeight= true
}) => {
  return (
    <Widget className={(minHeight ? "dashboard-card-min-h" : "") + "dashboard-card-widget"}>
      <Row className="dashboard-card-top-row">
        <Col>
          {hasToolTip ? (
            <div>
              <h1 className="dashboard-card-text">{title}</h1>
              <div className="tooltip">
                <FaInfoCircle className="info-circle" />
                <span className="tooltiptext">
                  <div className="left">
                    <FaInfoCircle className="info-circle-large" />
                  </div>
                  <div className="right">{toolTip}</div>
                </span>
              </div>
            </div>
          ) : (
            <h1 className="dashboard-card-text">{title}</h1>
          )}
        </Col>

        <Col>
          {mainValue || subValue ? (
            <Row>
              <Col>
                <img src={isUp ? greenArrow : redArrow} alt="up arrow" />
              </Col>
              {mainValue && (
                <Col className="dashboard-card-number-col">
                  <span
                    className={`dashboard-header-text ${
                      !isUp ? "text-red" : ""
                    }`}
                  >
                    {mainValue}
                  </span>
                </Col>
              )}
              {subValue && (
                <Col>
                  <span className="dashboard-header-text-second">
                    {subValue}
                  </span>
                </Col>
              )}
              {extraTopBar && (
                <Col>
                  <div className="card-dropdown">{extraTopBar}</div>
                </Col>
              )}
            </Row>
          ) : (
            extraTopBar && <div className="card-dropdown">{extraTopBar}</div>
          )}
        </Col>
      </Row>
      <div>{extra}</div>
    </Widget>
  );
};

export default DashboardCard;

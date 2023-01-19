import React from "react";
import { Row, Col } from "antd";

import "./dashboardStatics.css";
import Widget from "components/Widget";
import { FaInfoCircle } from "react-icons/fa";

const DashboardStatics = ({
  title,
  extra,
  header,
  image,
  imageColor,
  toolTip,
}) => {
  return (
    <Widget className="statics-card">
      <Row>
        <Col>
          <div className={imageColor}>
            <img src={image} alt="" />
          </div>
        </Col>
        <Col className="last-card-text-col">
          <Col>
            <Row>
              <span className="last-card-header-text">
                {title}
                <div className="tooltip">
                  <FaInfoCircle className="info-circle" />
                  <span className="tooltiptext">
                    <div className="iconing">
                      <FaInfoCircle className="info-circle-large" />
                    </div>
                    <div className="iconing">{toolTip}</div>
                  </span>
                </div>
              </span>
            </Row>
            <Row>
              <span className="last-card-text">{header}</span>
            </Row>
          </Col>
        </Col>
      </Row>
      {extra}
    </Widget>
  );
};

export default DashboardStatics;

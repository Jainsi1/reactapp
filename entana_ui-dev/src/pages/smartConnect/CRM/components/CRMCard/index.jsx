import React from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
// import 'modules/CRM/crm.css';
import { Row, Col } from 'antd';
import Info from "assets/images/info.svg";

const CRMCard = ({ heading, selected, initiativesCount, onCardClicked }) => {
  return (
    <div className={`main-card ${selected ? "selected" : ""}`} onClick={onCardClicked}>
      <span className="company-name">{heading}</span>
      <Row className="company-card">
        <Col span={5}>
          <div className="info-image">
            <img src={Info} alt="info" />
          </div>
        </Col>
        <Col span={19}>
          <span className="srm-card-text">
            <b>{initiativesCount}</b> INITIATIVES ON TRACK <br />
          </span>
        </Col>
      </Row>
    </div>
  );
};

export default CRMCard;
import React from "react";
import "swiper/css";
import "swiper/css/navigation";
// import "modules/SRM/srm.css";
import { Row, Col } from "antd";

import Calendar from "assets/images/Calender.svg";
import Info from "assets/images/info.svg";
import { Link } from "react-router-dom";

const SRMCard = (props) => {
  const {
    id,
    heading,
    mainNumber,
    mainInfoNumber,
    subInfoNumber,
    calNumber,
    subCalNumber,
    onCardClicked,
    selected,
    commodity
  } = props

  return (
    <div className={`main-card ${selected ? "selected" : ""}`} onClick={onCardClicked}>
      <Link to={"/org-profile/" + id}><span className="company-name">{heading.length > 20 ? heading.slice(0, 20) + '...' : heading} ({commodity})</span></Link>
      <Row className="company-card">
        <Col span={5}>
          <div className="info-image">
            <img src={Info} alt="info" />
          </div>
        </Col>
        <Col span={19}>
          <span className="srm-card-text">
            <b>{mainNumber}</b> INITIATIVES ON TRACK <br />
            <b>{mainInfoNumber}</b> EOL RISKS <br />
            {/* <b>{subInfoNumber}</b> SOLE/SINGLE SOURCE RISKS */}
          </span>
        </Col>
      </Row>
      {/* <Row className="company-card">
        <Col span={5}>
          <div className="calendar-image">
            <img src={Calendar} alt="Calendar" />
          </div>
        </Col>
        <Col span={19}>
          <span className="srm-card-text">
            EBR: <b>{calNumber}</b> <br />
            QBR: <b>{subCalNumber}</b>
          </span>
        </Col>
      </Row> */}
    </div>
  );
};

export default SRMCard;

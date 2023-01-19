import { Col } from "antd";
import logoLightImage from "../../assets/images/logo-light.svg";
import "./index.css";

export default function RegisterCard({ isBlur }) {
  return (
    <Col xs={24} md={12} className={(isBlur ? 'blur' : '')}>
      <div className="register-card-box">
        <div className="register-card-inside">
          <img className="logo" src={logoLightImage} alt="Entana"/>
          <div className="heading">Find out how Entana can improve your supplier collaboration.</div>
        </div>
        <div className="heading">Trusted by leading businesses</div>
      </div>
    </Col>
  )
};
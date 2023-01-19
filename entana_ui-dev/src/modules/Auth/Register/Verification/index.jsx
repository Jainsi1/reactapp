import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { Col, Row, Form, Input, Button, Card } from "antd"
import "./index.css"
import logoLightImage from "assets/images/logo-light.svg"
import { useEffect } from "react";
import RegisterCard from "../../../../components/RegisterCard";

export default function Verification(props) {
  const { type = 'register' } = props;

  const navigate = useNavigate();
  const { state } = useLocation();


  useEffect(() => {
    if ( !state?.email) {
      navigate('/login', { replace: true });
    }
  }, [state]);

  return (
    <Row>
      <RegisterCard/>

      <Col xs={24} md={12} className="verify-box">
        <Row>
          <Col xs={24} md={24}>
            <div className="card-header-text">
              <h2>Verify your email</h2>
              <p className="para-small">We’ve sent an email
                to {state?.email} to {type == 'register' ? "complete your account setup" : "forgot your password"}.</p>
            </div>
          </Col>
        </Row>
        <div className="register-div">

          <div className="space"></div>

          <span className="login-card-footer">
            Already have an account ?{" "}
            <NavLink className="login-card-footer-text" to="/login">
              Login
            </NavLink>
          </span>
        </div>
      </Col>
    </Row>
  )
}

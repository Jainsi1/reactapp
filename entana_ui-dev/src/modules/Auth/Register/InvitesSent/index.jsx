import { NavLink, useNavigate } from "react-router-dom"
import { Col, Row } from "antd"

import "./index.css"
import client from "../../../../apollo";
import { REGISTER_VALIDATE_TOKEN } from "../../graphql/mutation";
import { useEffect } from "react";
import RegisterCard from "../../../../components/RegisterCard";

export default function InvitesSent() {
  const navigate = useNavigate();

  async function verifyToken() {
    try {

      await client.query({
        context: {
          headers: {
            authorization: `Bearer ${localStorage.getItem('REGISTRATION_TOKEN')}`,
          }
        },
        query: REGISTER_VALIDATE_TOKEN,
      });

      //TODO remove in future
      navigate('/register/complete', {
        replace: true
      })

    } catch (e) {
      navigate('/login', {
        replace: true
      })
    }
  }

  useEffect(async () => {
    await verifyToken()
  }, []);

  return (
    <Row>
      <RegisterCard/>

      <Col xs={24} md={12} className="verify-box">
        <Row>
          <Col xs={24} md={24}>
            <div className="card-header-text">
              <h2>All invites have been sent.</h2>
            </div>
          </Col>
        </Row>
        <NavLink className="login-card-footer-text" to="/register/complete">
          Go to Next Page
        </NavLink>
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

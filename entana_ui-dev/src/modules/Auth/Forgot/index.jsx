import { NavLink, useNavigate } from "react-router-dom"
import { Col, Row, Form, Input, Button } from "antd"

import client from "apollo"
import { FORGOT_GENERATE_URL } from "../graphql/mutation"
import openNotification from "utils/Notification"
import "./index.css"
import RegisterCard from "../../../components/RegisterCard";

export default function Forgot() {
  const navigate = useNavigate();

  async function handleForgot(values) {
    try {

      await client.mutate({
        mutation: FORGOT_GENERATE_URL,
        variables: { input: values }
      });

      navigate('/forgot/verification', {
        replace: true,
        state: { email: values.email }
      });

    } catch (e) {
      openNotification("error", e.message)
    }
  }

  return (
    <Row>
      <RegisterCard/>

      <Col xs={24} md={12}>

        <Form name="basic" layout="vertical" className="registor-box" onFinish={handleForgot}>
          <Row>
            <Col xs={24} md={24}>
              <div className="card-header-text">
                <h2>Forgot your Entana account</h2>
              </div>
            </Col>
          </Row>

          <Row>

            <Form.Item
              label="Email"
              name="email"
              className="form-field"
              rules={[
                {
                  type: "email",
                  required: true,
                  message: "Please input your email",
                },
              ]}
            >
              <Input className="form-input-field" placeholder="Email"/>
            </Form.Item>

            <Button className="login-button" type="primary" htmlType="submit">
              <span className="button-text">Forgot</span>
            </Button>

            <div className="register-div">
              <span className="login-card-footer">
                Already have an account ?{" "}
                <NavLink className="login-card-footer-text" to="/login">
                  Login
                </NavLink>
              </span>
            </div>
          </Row>

        </Form>
      </Col>
    </Row>
  )
}

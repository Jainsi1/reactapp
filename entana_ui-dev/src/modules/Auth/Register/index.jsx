import { Navigate, NavLink, useNavigate } from "react-router-dom"
import { Col, Row, Form, Input, Button, Card } from "antd"
import client from "apollo"
import { REGISTER_GENERATE_URL } from "../graphql/mutation"
import openNotification from "utils/Notification"
import "./index.css"
import RegisterCard from "../../../components/RegisterCard/index";

export default function Register() {
  const navigate = useNavigate();

  async function handleRegister(values) {
    try {

      await client.mutate({
        mutation: REGISTER_GENERATE_URL,
        variables: { input: values }
      });

      navigate('/register/verification', {
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
        <Form name="basic" layout="vertical" className="registor-box" onFinish={handleRegister}>
          <Row>
            <Col xs={24} md={24}>
              <div className="card-header-text">
                <h2>Create your Entana account</h2>
              </div>
            </Col>
          </Row>

          <Row>

            <Row gutter={16} className="register-form-field">
              <Col xs={24} md={12}>
                <Form.Item
                  label="First Name"
                  name="firstName"
                  className="form-field"
                  rules={[
                    {
                      required: true,
                      message: "Please input your first name",
                    },
                  ]}
                >
                  <Input className="form-input-field-name" placeholder="First Name"/>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Last Name"
                  name="lastName"
                  className="form-field"
                  rules={[
                    {
                      required: true,
                      message: "Please input your last name",
                    },
                  ]}
                >
                  <Input className="form-input-field-name" placeholder="Last Name"/>
                </Form.Item>
              </Col>
            </Row>

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

            <Col xs={24} md={24}>
              <div className="space">

              </div>
              <p className="para">
                Creating an account means you agree to the Entana.net General Terms of Service and Privacy Notice, and
                agree that this account will not be used for primarily personal, family, or household purposes.
              </p>
            </Col>

            <Button className="login-button" type="primary" htmlType="submit">
              <span className="button-text">Register</span>
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

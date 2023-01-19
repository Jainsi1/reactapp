import { NavLink, useNavigate } from "react-router-dom"
import { Col, Row, Form, Input, Button } from "antd"

import "./index.css"
import client from "../../../../apollo";
import { FORGOT_PASSWORD, FORGOT_VALIDATE_URL } from "../../graphql/mutation";
import openNotification from "utils/Notification";
import { useEffect } from "react";
import RegisterCard from "../../../../components/RegisterCard";

export default function Password() {
  const navigate = useNavigate();
  const email = new URLSearchParams(window.location.search).get('email');

  useEffect(async () => {
    try {

      await client.mutate({
        mutation: FORGOT_VALIDATE_URL,
        variables: {
          input: {
            url: window.location.href,
          }
        }
      });

    } catch (e) {
      openNotification("error", e.message)
      navigate('/login');
    }
  }, []);


  const handleForgot = async (values) => {
    try {

      await client.mutate({
        mutation: FORGOT_PASSWORD,
        variables: {
          input: {
            url: window.location.href,
            password: values.password
          }
        }
      });

      openNotification("success", "Password has been reset successfully");

      setTimeout(() => {
        navigate(`/login`, { replace: true });
      }, 3000)

    } catch (e) {
      openNotification("error", e.message)
    }
  }

  return (
    <Row>
      <RegisterCard/>

      <Col xs={24} md={12} className="verify-box">
        <Form name="basic" layout="vertical" onFinish={handleForgot}>

          <Row>
            <Col xs={24} md={24}>
              <div className="card-header-text">
                <h2>Forgot your password for Entana.net</h2>
              </div>
            </Col>
          </Row>
          <Form.Item
            label="Email"
            name="Email"
            className="form-field"
          >
            <p>{email}</p>
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            className="form-field"
            rules={[
              {
                required: true,
                message: "Please input your password",
              },
            ]}
          >
            <Input.Password className="form-input-field" placeholder="Password"/>
          </Form.Item>

          <Form.Item
            className="form-field"
            label="Retype Password"
            name="RetypePassword"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "Please confirm your password",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if ( !value || getFieldValue("password") === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(
                    new Error("The two passwords that you entered do not match!")
                  )
                },
              }),
            ]}
          >
            <Input.Password className="form-input-field" placeholder="Password"/>
          </Form.Item>

          <div className="child-box">
            <ul className="child">
              <li>Use upper case and lower case letters</li>
              <li>Use a number or symbol Use 8 or more</li>
              <li>characters</li>
            </ul>
          </div>
          <Row
            type="flex"
            justify="center"
            style={{ marginTop: "1rem" }}
            align="middle">
            <Button className="login-button" type="primary" htmlType="submit">
              <span className="button-text">Submit</span>
            </Button>
          </Row>
          <div className="register-div">
            <span className="login-card-footer">
            Already have an account ?{" "}
              <NavLink className="login-card-footer-text" to="/login">
              Login
            </NavLink>
          </span>
          </div>
        </Form>
      </Col>
    </Row>
  )
}

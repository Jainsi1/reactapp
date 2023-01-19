import { NavLink, useNavigate } from "react-router-dom"
import { Col, Row, Form, Input, Button } from "antd"
import "./index.css"
import client from "../../../../apollo";
import { REGISTER_USER, REGISTER_VALIDATE_URL } from "../../graphql/mutation";
import openNotification from "utils/Notification";
import { useEffect } from "react";
import RegisterCard from "../../../../components/RegisterCard";

export default function Password() {
  const navigate = useNavigate();
  const email = new URLSearchParams(window.location.search).get('email');

  useEffect(async () => {
    try {

      await client.mutate({
        mutation: REGISTER_VALIDATE_URL,
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


  const handleRegister = async (values) => {
    try {

      const { data: { registerUser } } = await client.mutate({
        mutation: REGISTER_USER,
        variables: {
          input: {
            url: window.location.href,
            password: values.password
          }
        }
      });

      localStorage.setItem("REGISTRATION_TOKEN", registerUser.token)

      if (registerUser?.message) {
        localStorage.setItem("REGISTRATION_WELCOME_MESSAGE", registerUser.message)
      }

      navigate(`/register/${registerUser.nextScreen}`, {
          replace: true,
          state: {
            role: registerUser.role === "supplier" ? "supplier" : "buyer",
            disabledBack: true
          }
        }
      );

    } catch (e) {
      openNotification("error", e.message)
    }
  }

  function checkPasswordPolicy(value) {
    //validate length
    if (value?.length < 8) {
      return false
    }

    //validate uppercase and lowercase letter
    if ( !value.match(/[a-z]/) && !value.match(/[A-Z]/)) {
      return false
    }

    //validate number
    if ( !value.match(/\d/)) {
      return false
    }

    //validate symbol
    if ( !value.match(/([!"#$%&'()*+,-./:;<=>?@\[\]\s^_`{|}~])/)) {
      return false
    }

    return true
  }

  return (
    <Row>
      <RegisterCard/>

      <Col xs={24} md={12} className="verify-box">

        <Form name="basic" layout="vertical" onFinish={handleRegister}>

          <Row>
            <Col xs={24} md={24}>
              <div className="card-header-text">
                <h2>Create your password for Entana.net</h2>
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
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if ( !value || checkPasswordPolicy(value)) {
                    return Promise.resolve()
                  }
                  return Promise.reject(
                    new Error("The password is not matched with the password policy!")
                  )
                },
              }),
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

          <div className="child-box" style={{ width: "100%" }}>
            <ul className="child">
              <li>Use upper case and lower case letters</li>
              <li>Use a number or symbol Use 8 or more characters</li>
            </ul>
          </div>
          <Row
            type="flex"
            justify="center"
            style={{ marginTop: "1rem" }}
            align="middle">
            <Button className="login-button" type="primary" htmlType="submit">
              <span className="button-text">Next</span>
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

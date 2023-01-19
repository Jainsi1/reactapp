import { NavLink, useLocation, useNavigate } from "react-router-dom"
import React, { useEffect } from 'react';

import { Col, Row, Form, Input, Button } from "antd"
import "./index.css"
import client from "../../../../apollo";
import { REGISTER_USER_ORGANIZATION, REGISTER_VALIDATE_TOKEN } from "../../graphql/mutation";
import openNotification from "utils/Notification";
import RegisterCard from "../../../../components/RegisterCard";

export default function Organization() {
  const navigate = useNavigate();

  const { state } = useLocation();

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

    } catch (e) {
      navigate('/login', {
        replace: true
      })
    }
  }

  useEffect(async () => {
    if ( !state?.role) {
      navigate('/login', { replace: true });
    }

    await verifyToken()

  }, [state]);

  const handleBack = () => {
    navigate('/register/role', {
      replace: true,
      state: { role: state.role }
    })
  }

  async function handleRegister(values) {
    try {

      const { data: { registerUserOrganization } } = await client.mutate({
        context: {
          headers: {
            authorization: `Bearer ${localStorage.getItem('REGISTRATION_TOKEN')}`,
          }
        },
        mutation: REGISTER_USER_ORGANIZATION,
        variables: {
          input: {
            company_name: values.company_name,
            commodity_name: values?.commodity_name
          }
        },

      });

      if (values?.commodity_name) {
        localStorage.setItem("REGISTRATION_WELCOME_MESSAGE", registerUserOrganization.message)
      }

      navigate(`/register/invite`, {
        replace: true,
      });

    } catch (e) {
      openNotification("error", e.message)
    }
  }

  return (
    <Row>
     <RegisterCard/>

      <Col xs={24} md={12} className="verify-box">
        <Form name="basic" layout="vertical" onFinish={handleRegister}>
          <Row>
            <Col xs={24} md={24}>
              <div className="card-header-text">
                <h2>Tell us about your business</h2>
              </div>
            </Col>
          </Row>
          <Form.Item
            label="Company Name"
            name="company_name"
            className="form-field"
            rules={[
              {
                required: true,
                message: "Please input your Company Name",
              },
            ]}
          >
            <Input className="form-input-field" placeholder="Enter your company name"/>
          </Form.Item>

          {state?.role === 'buyer' ?
            <Form.Item
              label="Commodity / Category you manage"
              name="commodity_name"
              className="form-field"
              rules={[
                {
                  required: true,
                  message: "Please input your Commodity / Category you manage",
                },
              ]}
            >
              <Input className="form-input-field"
                     placeholder="Enter your commodity / category. You can edit this later."/>
            </Form.Item>
            : null}

          <div className="space"></div>
          <div className="space"></div>

          <Row
            type="flex"
            justify="center"
            align="middle">
            <Col xs={24} md={16}></Col>
            <Col xs={24} md={24}>
              <Row
                type="flex"
                justify="center"
                align="middle"
              >
                <Col xs={10} md={6}>
                  {state?.disabledBack ? null :
                    <a className="" onClick={handleBack}>
                      <span className="">Back</span>
                    </a>
                  }
                </Col>
                <Col xs={2} md={12}></Col>
                <Col xs={10} md={6}>
                  <Button className="login-button" type="primary" htmlType="submit">
                    <span className="button-text">Next</span>
                  </Button>
                </Col>
              </Row>
            </Col>

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

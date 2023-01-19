import { NavLink, useLocation, useNavigate } from "react-router-dom"
import React, { useEffect } from 'react';

import { Col, Row, Form, Button, Radio, Space } from "antd"
import "./index.css"
import client from "../../../../apollo";
import { REGISTER_USER_ROLE, REGISTER_VALIDATE_TOKEN } from "../../graphql/mutation";
import openNotification from "utils/Notification";
import RegisterCard from "../../../../components/RegisterCard";

export default function Role() {
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
    await verifyToken()
  }, []);

  async function handleRegister(values) {
    try {

      await client.mutate({
        context: {
          headers: {
            authorization: `Bearer ${localStorage.getItem('REGISTRATION_TOKEN')}`,
          }
        },
        mutation: REGISTER_USER_ROLE,
        variables: {
          input: {
            role: values.role
          }
        },

      });

      navigate(`/register/organization`, {
        replace: true,
        state: { role: values.role }
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
                <h2>What is your relationship with the company?</h2>
                <div className="small-para">This will help make sure you have the right information access control
                  available under settings.
                </div>
              </div>
            </Col>
          </Row>

          <div className="radio-box">
            <Form.Item
              name="role"
              className="form-field"
              rules={[
                {
                  required: true,
                  message: "Please select your role",
                },
              ]}
              initialValue={state?.role}
            >
              <Radio.Group>
                <Space direction="vertical">
                  <Radio value="buyer">I’m a buyer.</Radio>
                  <Radio value="supplier">I’m a supplier.</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
          </div>


          <div className="child-box">
            <div>You may know</div>

            <ul className="child">
              <li>
                “Buyer” as Commodity Manager, Supply Manager, Category Manger, Buyer
              </li>
              <li>
                “Supplier”as Supplier Account Manager, Account Executive, Sales, Sales Support
              </li>
            </ul>
          </div>
          <div className="space"></div>
          <Row
            type="flex"
            justify="center"
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

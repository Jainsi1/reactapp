import { NavLink, useNavigate } from "react-router-dom"
import React, { useEffect, useState } from 'react';

import { Col, Row, Form, Input, Button, Radio, Space } from "antd"
import "./index.css"
import { MinusCircleOutlined } from "@ant-design/icons";
import client from "../../../../apollo";
import { REGISTER_USER_INVITE, REGISTER_VALIDATE_TOKEN } from "../../graphql/mutation";
import openNotification from "utils/Notification";
import RegisterCard from "../../../../components/RegisterCard";

export default function Invite() {
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

  async function handleRegister(values) {
    try {

      await client.mutate({
        context: {
          headers: {
            authorization: `Bearer ${localStorage.getItem('REGISTRATION_TOKEN')}`,
          }
        },
        mutation: REGISTER_USER_INVITE,
        variables: {
          input: {
            users: values.users,
          }
        },

      });

      navigate(`/register/invites-sent`, {
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
        <Form name="dynamic_form_nest_item" onFinish={handleRegister} autoComplete="off">
          <Row>
            <Col xs={24} md={24}>
              <div className="card-header-text">
                <h2>Congratulations!</h2>
              </div>
            </Col>
          </Row>
          <div className="space"></div>
          <div className="small-para">Your account has been setup.</div>
          <br/>
          <div className="small-para">You do not have any connections to collaborate with yet. We recommend you invite
            your peers.
          </div>
          <br/>

          <Form.List name="users" initialValue={[{}]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key}>
                    <Row gutter={16}>
                      <Col xs={12} md={11}>
                        <Form.Item
                          {...restField}
                          label="First Name"
                          name={[name, 'firstName']}
                          className="box-field"
                          rules={[
                            {
                              required: true,
                              message: "Please enter your first name",
                            },
                          ]}
                        >
                          <Input className="form-input-field" placeholder=""/>
                        </Form.Item>
                      </Col>
                      <Col xs={12} md={11}>
                        <Form.Item
                          {...restField}
                          label="Last Name"
                          name={[name, 'lastName']}
                          className="box-field"
                          rules={[
                            {
                              required: true,
                              message: "Please enter your last name",
                            },
                          ]}
                        >
                          <Input className="form-input-field" placeholder=""/>
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={2} style={{ textAlign: "right" }}>
                        <MinusCircleOutlined
                          style={{ paddingTop: 12 }}
                          onClick={() => remove(name)}
                        />
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col xs={24} md={11}>
                        <Form.Item
                          {...restField}
                          label="Email"
                          name={[name, 'email']}
                          className="box-field"
                          rules={[
                            {
                              required: true,
                              message: "Please enter your email",
                            },
                          ]}
                        >
                          <Input className="form-input-field" placeholder=""/>
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item
                          {...restField}
                          label="Relationship"
                          name={[name, 'role']}
                          rules={[
                            {
                              required: true,
                              message: "Please select role",
                            },
                          ]}
                        >
                          <div className="invite-radio-box">
                            <Radio.Group>
                              <Space direction="vertical">
                                <Radio className="" value="buyer">Buyer</Radio>
                                <Radio className="" value="supplier">Supplier</Radio>
                              </Space>
                            </Radio.Group>
                          </div>
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                ))}
                <div style={{ textAlign: "left" }}>
                  <a onClick={() => add()} className="add-more">+ Add More</a>
                </div>
              </>
            )}
          </Form.List>

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
                <Col xs={20} md={14}></Col>
                <Col xs={2} md={4}>
                  <NavLink className="" to="/register/complete">
                    <span className="">Skip</span>
                  </NavLink>
                </Col>
                <Col xs={10} md={4}>
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

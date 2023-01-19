import { useNavigate } from "react-router-dom"
import { Col, Row, Button } from "antd"

import "./index.css"
import { useEffect, useState } from "react";
import client from "../../../../apollo";
import { REGISTER_USER_COMPLETE, REGISTER_VALIDATE_TOKEN } from "../../graphql/mutation";
import openNotification from "utils/Notification";
import RegisterCard from "../../../../components/RegisterCard";

export default function Complete() {
  const navigate = useNavigate();
  const [isStart, setIsStart] = useState(false);

  const welcomeMessage = localStorage.getItem("REGISTRATION_WELCOME_MESSAGE")

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

  async function onStartEntana() {

    try {
      setIsStart(true)

      await client.mutate({
        context: {
          headers: {
            authorization: `Bearer ${localStorage.getItem('REGISTRATION_TOKEN')}`,
          }
        },
        mutation: REGISTER_USER_COMPLETE,
      });

      setTimeout(() => {
        localStorage.removeItem("REGISTRATION_TOKEN")
        localStorage.removeItem("REGISTRATION_WELCOME_MESSAGE")

        navigate("/login", {
          replace: true,
          state: {}
        })
      }, 3000)

    } catch (e) {
      setIsStart(false)
      openNotification("error", e.message)
    }
  }

  return (
    <Row>
      {isStart ?
        <div className="overlay-box">
          <p className="overlay-head">Setting up your awesome profile and redirecting...</p>
          <p className="overlay-para">Congratulations on taking your first step towards Better Supplier
            Collaboration! </p>
        </div>
        : null}

      <RegisterCard isBlur={isStart}/>

      <Col xs={24} md={12} className={(isStart ? 'blur' : '') + ' verify-box'}>
        <Row>
          <Col xs={24} md={24}>
            <div className="card-header-text">
              <h2>Welcome to Entana.</h2>
              {welcomeMessage ?
                <div className="small-heading">{welcomeMessage}</div>
                : null}
            </div>
          </Col>
        </Row>
        <div className="space"></div>
        <div className="space"></div>

        <Row
          type="flex"
          justify="center"
          align="middle">
          <Button className="login-button" type="primary" disabled={isStart} onClick={onStartEntana}>
            <span className="button-text">Start using Entana now.</span>
          </Button>
        </Row>
      </Col>

    </Row>
  )
}

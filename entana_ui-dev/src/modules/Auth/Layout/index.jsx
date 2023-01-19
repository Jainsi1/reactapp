import {Col, Row} from "antd"
import {Fragment} from "react"
import {Navigate, NavLink} from "react-router-dom"
import "./index.css"
import Footer from "./Footer"
import logoImage from "assets/images/logo.svg"

export default function AuthLayout({children, isRegister = false}) {
  const isAuthenticated = localStorage.getItem("token")

  if (isAuthenticated) return <Navigate to="/"/>

  return (
    <Fragment>
      <Row
        type="flex"
        justify="center"
        align="middle"
        className="login-main-row"
      >
        <Col span={24}>
          {isRegister ? <span></span> : <Row>
            <Col span={24} className="login-logo-col">
              <NavLink to="/" className="nav-text">
                <img className="Main-Logo" src={logoImage} alt="Entana"/>
              </NavLink>
            </Col>
          </Row>}
          <div>
            <Row>
              {/* <Col xs={2} md={4} xl={8} /> */}
              <Col xs={2} md={4} xl={isRegister ? 4 : 8}/>
              <Col xs={20} md={isRegister ? 18 : 16} xl={isRegister ? 16 : 8}
                   className={isRegister ? "registor-card" : "login-card"}>
                {/* <div className="card-header-text">
                  {isRegister ? <h2>Register</h2> : <h2>Login</h2>}
                </div> */}
                {children}
              </Col>
              {/* <Col xs={2} md={4} xl={8} /> */}
              <Col xs={2} md={4} xl={isRegister ? 4 : 8}/>
            </Row>


          </div>
        </Col>
      </Row>
      <Footer/>
    </Fragment>
  )
}

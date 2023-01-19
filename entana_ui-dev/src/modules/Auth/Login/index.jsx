import { NavLink, useNavigate } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import client from 'apollo';
import logoImage from "assets/images/logo.svg"
import openNotification from 'utils/Notification';
import { LOGIN_USER } from '../graphql/mutation';
import { GET_CURRENT_USER } from '../graphql/query';
import { authLogin } from '../';
import history from 'utils/CustomHistory';
import "./index.css"

export default function Login() {
  let navigate = useNavigate();

  const handleGroupSelection = (role, groups) => {
    if (groups.length === 1 || role !== 'commodity manager') {
      // if there is ony 1 group we will redirect to dashboard directly
      localStorage.setItem('currentGroup', JSON.stringify(groups[ 0 ]));
      history.push('/', { replace: true });
      window.location.reload(true);
    } else {
      // redirect to group selection page
      navigate('/group-selection', { replace: true });
    }
  };

  function handleNextScreen(registerUser) {
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
  }

  const handleLogin = async (values) => {
    try {
      const response = await client.mutate({ mutation: LOGIN_USER, variables: { input: values } });

      //handle verification not completed uses
      if (response?.data?.login?.nextScreen) {
        return handleNextScreen(response.data.login)
      }

      authLogin(response);
      const { data: { currentUser } } = await client.query({ query: GET_CURRENT_USER });
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      openNotification('success', 'Logged in successfully');
      handleGroupSelection(currentUser.role, currentUser.groups);
    } catch (error) {
      openNotification("error", error.message)
    }
  }

  return (
    <div>
      {/* <NavLink to="/" className="nav-text">
       <img className="Main-Logo" src={logoImage} alt="Entana" />
       </NavLink> */}
      <Form name="login_form" layout="vertical" onFinish={handleLogin}>
        <div className="card-header-text">
          <h2>Login</h2>
        </div>
        <Form.Item
          label="Email"
          name="email"
          className="form-field"
          rules={[
            {
              type: "email",
              required: true,
              message: "Please input your email!",
            },
          ]}
        >
          <Input className="form-input-field" placeholder="Email"/>
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          className="form-field"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password className="form-input-field" placeholder="Password"/>
        </Form.Item>

        <div className="login-card-forgot-text">
          <NavLink className="login-forgot-text" to="/forgot">
            Forgot password
          </NavLink>
        </div>

        <Form.Item>
          <Button className="login-button" type="primary" htmlType="submit">
            <span className="button-text">Login</span>
          </Button>
          <div className="register-div">
            <span className="login-card-footer">
              Don"t have an account ?{" "}
              <NavLink className="login-card-footer-text" to="/register">
                Register
              </NavLink>
            </span>
          </div>
        </Form.Item>
      </Form>
    </div>
  )
}

import { Routes, Route, BrowserRouter } from "react-router-dom";

import Layout from "Layout";
import Login from "modules/Auth/Login";
import Register from "modules/Auth/Register";
import AuthLayout from "modules/Auth/Layout";
import GuardedRoute from "modules/Auth/GuardedRoute";
import Logout from "modules/Auth/Logout";
import GroupSelector from "modules/GroupSelector";
import Verification from './modules/Auth/Register/Verification/index';
import Password from './modules/Auth/Register/Password/index';
import ForgotPassword from './modules/Auth/Forgot/Password/index';
import Complete from './modules/Auth/Register/Complete/index';
import Role from './modules/Auth/Register/Role/index';
import Organization from './modules/Auth/Register/Organization/index';
import Invite from './modules/Auth/Register/Invite/index';
import InvitesSent from './modules/Auth/Register/InvitesSent/index';
import Forgot from "./modules/Auth/Forgot";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/*"
          element={
            <GuardedRoute>
              <Layout/>
            </GuardedRoute>
          }
        />
        <Route
          path="/group-selection"
          element={<GroupSelector/>}
        />
        <Route
          path="/login"
          element={
            <AuthLayout>
              <Login/>
            </AuthLayout>
          }
        />
        <Route
          path="/register"
          element={
            <AuthLayout isRegister>
              <Register/>
            </AuthLayout>
          }
        />
        <Route
          path="/register/verification"
          element={
            <AuthLayout isRegister>
              <Verification/>
            </AuthLayout>
          }
        />
        <Route
          path="/register/password"
          element={
            <AuthLayout isRegister>
              <Password/>
            </AuthLayout>
          }
        />
        <Route
          path="/register/role"
          element={
            <AuthLayout isRegister>
              <Role/>
            </AuthLayout>
          }
        />
        <Route
          path="/register/organization"
          element={
            <AuthLayout isRegister>
              <Organization/>
            </AuthLayout>
          }
        />
        <Route
          path="/register/invite"
          element={
            <AuthLayout isRegister>
              <Invite/>
            </AuthLayout>
          }
        />
        <Route
          path="/register/invites-sent"
          element={
            <AuthLayout isRegister>
              <InvitesSent/>
            </AuthLayout>
          }
        />
        <Route
          path="/register/complete"
          element={
            <AuthLayout isRegister>
              <Complete/>
            </AuthLayout>
          }
        />
        <Route
          path="/forgot"
          element={
            <AuthLayout isRegister>
              <Forgot/>
            </AuthLayout>
          }
        />
        <Route
          path="/forgot/verification"
          element={
            <AuthLayout isRegister>
              <Verification type="forgot"/>
            </AuthLayout>
          }
        />
        <Route
          path="/forgot/password"
          element={
            <AuthLayout isRegister>
              <ForgotPassword/>
            </AuthLayout>
          }
        />
        <Route path="/logout" element={<Logout/>}/>
      </Routes>
    </BrowserRouter>
  )
}

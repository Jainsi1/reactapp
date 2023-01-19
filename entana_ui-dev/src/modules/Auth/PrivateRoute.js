import Layout from 'Layout'
import {Navigate} from 'react-router-dom'

export default function PrivateRoute() {
  const isAuthenticated = localStorage.getItem("token")

  return isAuthenticated ? <Layout/> : <Navigate to="/login"/>
}

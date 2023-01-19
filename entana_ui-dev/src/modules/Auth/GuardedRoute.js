import { Navigate } from 'react-router-dom'

function GuardedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('token')

  return !!isAuthenticated ? children : <Navigate to="/login"/>;

}

export default GuardedRoute

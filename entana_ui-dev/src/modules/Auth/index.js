import openNotification from 'utils/Notification';
import {Navigate} from 'react-router-dom';

export function authLogin(response) {
  localStorage.setItem('token', JSON.stringify(response.data.login.token))
}

export function authLogout() {
  openNotification('success', 'Logout Successfully')
  localStorage.removeItem('currentUser')
  localStorage.removeItem('currentGroup');
  localStorage.removeItem('token')
  Navigate('/', {replace: true})
}

export function authRegister() {
  Navigate('/verify', {replace: true})
}
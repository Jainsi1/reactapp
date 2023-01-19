import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import openNotification from 'utils/Notification';

export default function Logout() {
  useEffect(() => {
    localStorage.clear();

    openNotification('success', 'Logout Successfully');

  }, [])

  return <Navigate to="/login" />
}

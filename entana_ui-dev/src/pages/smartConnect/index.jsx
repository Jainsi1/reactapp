import { getUserRole } from 'utils/user';
import SRM from './SRM';
import CRM from './CRM';

const userRole = getUserRole();
const SmartConnect = () => {
  if (userRole === 'commodity manager') {
    return <SRM />
  }
  return <CRM />
};

export default SmartConnect;
import React from 'react';
import { getUserRole } from 'utils/user';
import CustomerSettings from 'components/CustomerSettings';
import SupplierSettings from 'components/SupplierSettings';

const role = getUserRole();

const Settings = () => {
  return role === "supplier" ? <SupplierSettings /> : <CustomerSettings />;
};

export default Settings;

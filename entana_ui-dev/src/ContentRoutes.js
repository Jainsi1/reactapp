import { Routes, Route } from 'react-router-dom';

import SmartConnect from 'pages/smartConnect';
import CostManagement from 'modules/CostManagement';
import RoadMapPlanning from 'modules/RoadMapPlanning';
import Task from 'modules/Kanban';
import Settings from 'modules/Settings';
import CommoditySettings from 'components/CommoditySettings';
import Profile from './modules/Profile';
import SupplierProfile from './pages/organizationProfile';
import NotificationPage from './pages/notification'
import SupplyIQPage from './pages/SupplyIqPcr';
import Messenger from './modules/Messenger';
import HomePage from 'pages/homepage';
import SupplyPcrReport from "./pages/supplyPcrReport";
import { getUserRole } from "./utils/user";

export default function ContentRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="smart-connect" element={<SmartConnect/>}/>
      <Route path="cost-management" element={<CostManagement/>}/>
      <Route path="road-map-planning" element={<RoadMapPlanning/>}/>
      <Route path="task" element={<Task/>}/>
      <Route path="settings" element={<Settings/>}/>
      <Route path="commodity/:id" element={<CommoditySettings/>}/>
      <Route path="notifications" element={<NotificationPage/>}/>
      <Route path="supply-iq-pcr" element={<SupplyIQPage/>}/>
      {getUserRole() === 'commodity manager' && (
        <Route path="supply-pcr-report" element={<SupplyPcrReport/>}/>
      )}
      <Route path="messenger" element={<Messenger/>}/>
      <Route path="/user-profile">
        <Route index element={<Profile/>}/>
        <Route path=":id" element={<Profile/>}/>
      </Route>
      <Route path="/org-profile">
        <Route index element={<SupplierProfile/>}/>
        <Route path=":id" element={<SupplierProfile/>}/>
      </Route>
    </Routes>
  )
}

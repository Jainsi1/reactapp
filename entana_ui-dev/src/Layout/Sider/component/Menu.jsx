import React from "react";
import { Menu } from "antd";
import {
  TeamOutlined,
  PieChartOutlined,
  SettingOutlined,
  DatabaseOutlined,
  FormOutlined,
  UnorderedListOutlined, BarChartOutlined,
} from "@ant-design/icons";
import SubMenu from 'antd/lib/menu/SubMenu'
import { NavLink } from "react-router-dom";
import { getUserRole } from "../../../utils/user";

export default function SideBarMenu() {

  console.log(getUserRole())

  return (
    <Menu
      className="sidebar-menu"
      theme="dark"
      mode="inline"
      // defaultSelectedKeys={['1']}
    >
      <Menu.Item key="1" icon={<PieChartOutlined/>}>
        <NavLink to="/" className="nav-text">
          Home
        </NavLink>
      </Menu.Item>
      <Menu.Item key="2" icon={<TeamOutlined/>}>
        <NavLink to="/smart-connect" className="nav-text">
          Smart Connect
        </NavLink>
      </Menu.Item>

      <SubMenu key="SupplyIQ" icon={<DatabaseOutlined/>} title="Supply-IQ">
        <Menu.Item icon={<FormOutlined/>}>
          <NavLink to="/supply-iq-pcr" className="nav-text">
            Change Request
          </NavLink>
        </Menu.Item>
      </SubMenu>

      <Menu.Item key="4" icon={<UnorderedListOutlined/>}>
        <NavLink to="/task" className="nav-text">
          Kanban Board
        </NavLink>
      </Menu.Item>

      {getUserRole() === 'commodity manager' && (
        <Menu.Item key="6" icon={<BarChartOutlined/>}>
          <NavLink to="/supply-pcr-report" className="nav-text">
            Reports
          </NavLink>
        </Menu.Item>
      )}

    </Menu>
  );
}

import {
  Layout as AntdLayout, PageHeader,
} from "antd";
import { useEffect, useState } from "react";

import ContentRoutes from "ContentRoutes"

import HeaderLayout from "./Header";
import SiderLayout from "./Sider";

import "./layout.css";
import { SocketContext, socket } from 'context/socket';

const { Content } = AntdLayout

const useCollapseToggle = () => {
  const [collapsed, setCollapsed] = useState(false)


  const toggle = () => {
    setCollapsed( !!!collapsed)
  }

  return [collapsed, toggle]
}

export default function Layout() {
  const [collapsed, toggle] = useCollapseToggle()

  const _socket = socket();

  useEffect(() => {
    _socket.on('connect', () => {
      console.log("Socket is connected")
    });

    _socket.on('disconnect', () => {
      console.log("Socket is disconnect")
    });

    return () => {
      _socket.off('connect');
      _socket.off('disconnect');
    };
  }, []);

  return (
    <SocketContext.Provider value={_socket}>
      <AntdLayout className="antd-layout">
        <SiderLayout collapsed={collapsed}/>
        <AntdLayout className="site-layout" style={{ marginLeft: collapsed ? 80 : 200 }}>
          <HeaderLayout toggle={toggle} collapsed={collapsed}/>
          <Content
            className="site-layout-background content-layout"
            style={{ margin: '50px 0px 0', overflow: 'initial' }}>
            <ContentRoutes/>
          </Content>
        </AntdLayout>
      </AntdLayout>
    </SocketContext.Provider>
  )
}

import {
  Badge,
} from "antd"
import {
  MessageOutlined
} from "@ant-design/icons"

import React from "react";
import { NavLink } from "react-router-dom";

export default function MessengerBadge() {
  return (
    <NavLink to="/messenger" className="nav-text">
      <Badge count={0} className="badge-icon">
        <MessageOutlined
          className="bell-icon"
          style={{ marginRight: "1rem" }}
        />
      </Badge>
    </NavLink>
  )
}
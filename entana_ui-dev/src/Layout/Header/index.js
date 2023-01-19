import { Layout as LayoutAntd } from "antd/";
import { NavLink } from "react-router-dom";

import NotificationPopOver from "./component/NotificationPopOver";
import ProfilePopOver from "./component/ProfilePopOver";
import { FaRegListAlt } from "react-icons/fa";

import {
    MenuOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons'
import MessengerBadge from "./component/MessengerBadge";


const { Header } = LayoutAntd;



export default function HeaderLayout(props) {

    const { collapsed, toggle } = props

    return (
        <Header
            className="site-layout-background header-layout"
            style={{ position: 'fixed', zIndex: 999, width: '-webkit-fill-available' }}>
            <div className="header-wrapper">
                <div>
                    {collapsed ?
                        <MenuOutlined className="trigger" onClick={toggle} /> :
                        <MenuUnfoldOutlined className="trigger" onClick={toggle} />
                    }
                    {/* 
                        TODO: Not being used right now. Will enable back when we have search.
                        <Input size="small" placeholder="Search" />
                    */}
                </div>
                <div className="notification-popover">
                    <NavLink to="/task" className="nav-text">
                        <FaRegListAlt className="kanban-icon" />
                    </NavLink>
                    <MessengerBadge />
                    <NotificationPopOver />
                    <ProfilePopOver />
                </div>
            </div>
        </Header>
    );
}
// import 
import SideBarMenu from "./component/Menu"
import LogoIcon from "assets/images/logo-icon.svg"
import LogoImage from "assets/images/alter-logo.svg"
import { NavLink } from "react-router-dom"
import {
  Tag,
  Layout as LayoutAntd
} from 'antd'

const {Sider} = LayoutAntd;

export default function SiderLayout(props) {
    const {collapsed} = props

    return (
        <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
            }}
        >
            <div className="logo">
                <NavLink to="/" className="nav-text">
                    <img src={collapsed ? LogoIcon : LogoImage} alt="Entana" />
                </NavLink>
            </div>
            <SideBarMenu />
            <div className="sidebar-tag">
                <Tag className="node-env-text" color="blue">
                    {process.env.REACT_APP_NODE_ENVIRONMENT}
                </Tag>
            </div>
        </Sider>
    )
}
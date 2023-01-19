
import {
    Avatar,
    Popover
} from 'antd'

import { useState, useEffect } from 'react'

import { PoweroffOutlined, UserOutlined, SettingOutlined } from "@ant-design/icons"
import { useNavigate } from 'react-router-dom';

import { getProfileImage } from "utils/user";
import { getUserFirstName, getUserLastName, getOrganizationName } from 'utils/user';

import userLogo from "assets/images/user-logo.svg"


export default function ProfilePopOver() {

    const [profileImage] = useProfileImage()
    const username = `${getUserFirstName()} ${getUserLastName()}`
    const organizationName = getOrganizationName()

    return (
        <Popover
            content={`${username} (${organizationName})`}
            className="profile-image-popover-content"
            placement="bottomRight"
        >
            <Popover
                placement="bottomRight"
                content={UserMenuOptions}
                trigger="click"
                className="notification-layout"
            >
                <Avatar className="avatar-icon" src={profileImage} size={40} />
            </Popover>
        </Popover>
    )
}


const useProfileImage = () => {
    const [profileImage, setProfileImage] = useState(getProfileImage() || userLogo);
    const [hasListenerAdded, setHasListenerAdded] = useState(false);


    useEffect(() => {
        const SET_PROFILE_IMAGE_EVENT = 'setProfileImage'
        function passProfileDetail({ detail }) {
            setProfileImage(detail)
        }


        if (!!!hasListenerAdded) {

            setHasListenerAdded(true)
            window.addEventListener(SET_PROFILE_IMAGE_EVENT, passProfileDetail);

            return () => window.removeEventListener(SET_PROFILE_IMAGE_EVENT, passProfileDetail);
        }

    }, [])

    return [profileImage]
}


const UserMenuOptions = () => {
    const navigate = useNavigate()


    return (
        <ul className="gx-user-popover">
            <li onClick={() => navigate("/user-profile", { replace: true })}>
                <UserOutlined /> Profile
            </li>
            <li onClick={() => navigate("/settings", { replace: true })}>
                <SettingOutlined /> Settings
            </li>
            <li onClick={() => navigate("/logout", { replace: true })}>
                <PoweroffOutlined /> Logout
            </li>
        </ul>
    )
}



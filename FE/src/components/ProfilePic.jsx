import React,{useContext} from 'react';
import { UserContext } from '../context/userContext';
import {UserOutlined} from "@ant-design/icons";
import {Avatar} from "antd";
const ProfilePic = () => {
    const {user} = useContext(UserContext);
    return (
        <Avatar size={35} src={user?.profilePic?user.profilePic:<UserOutlined/>} className='ring-blue-400 ring-2' />
    )
}

export default ProfilePic;
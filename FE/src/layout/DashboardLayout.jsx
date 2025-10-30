import React, { useState, useEffect, useMemo } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { GlobalOutlined } from '@ant-design/icons';
import { Layout, Menu, theme, Spin } from 'antd';
import { Wallet, ChartArea, HandCoins, LogOut, Settings, Contact, Users, PlusCircle,MailPlus } from "lucide-react";
import ProfilePic from "../components/ProfilePic.jsx";
import instance from "../utils/instance";
import {API_PATH} from "../utils/apiPath";


const { Header, Content, Sider } = Layout;

const topItems = [
    { key: "language", icon: <GlobalOutlined />, label: "Language" },
    { key: "profile", icon: <ProfilePic />, label: <span className="pl-3">Profile</span> }
];

const DashboardLayout = () => {
    const { token: { colorBgContainer } } = theme.useToken();
    const navigate = useNavigate();
    const location = useLocation();

    const [groups, setGroups] = useState([]);
    const [loadingGroups, setLoadingGroups] = useState(true);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                setLoadingGroups(true);
                const response = await instance.get(API_PATH.GROUP.GET_MY_GROUPS);
                setGroups(response.data.data);
            } catch (error) {
                console.error("Failed to fetch groups:", error);
            } finally {
                setLoadingGroups(false);
            }
        };
        fetchGroups();
    }, []);

    const sidebarItems = useMemo(() => {
        const groupSubMenuItems = groups.map(group => ({
            key: `/group/${group._id}`,
            label: group.name,
        }));
        
        groupSubMenuItems.push(
            { type: 'divider' },
            {
                key: '/group/create', 
                label: 'Create',
                icon: <PlusCircle size={16} />,
            },
            {
                key: '/group/invite',
                label: 'Invite',
                icon: <MailPlus size={16} />
            }
        );

        return [
            { key: "/", icon: <ChartArea />, label: "Dashboard" },
            { key: "/income", icon: <Wallet />, label: "Income" },
            { key: "/expense", icon: <HandCoins />, label: "Expense" },
            { type: 'divider' },
            {
                key: "/group",
                icon: <Users />,
                label: "Group",
                children: loadingGroups ? null : groupSubMenuItems, 
            },
            { type: 'divider' },
            { key: "/setting", icon: <Settings />, label: "Setting" },
            { key: "/contact", icon: <Contact />, label: "Our Contact" },
            { key: "/logout", icon: <LogOut />, label: "Logout" },
        ];
    }, [groups, loadingGroups]);

    const handleMenuClick = ({ key }) => {
        if (key === '/logout') {
            localStorage.removeItem('token');
            navigate('/login');
        } else {
            navigate(key);
        }
    };

    return (
            <Layout style={{ minHeight: '100vh' }}>
                <Header className='flex items-center justify-between shadow-md shadow-blue-200'>
                    <Link to="/"><h1 className='text-xl font-semibold text-white'>Spend Wise</h1></Link>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        items={topItems}
                        style={{ minWidth: 0, flex: 'auto', justifyContent: 'flex-end' }}
                    />
                </Header>
                <Layout>
                    <Sider width={200} style={{ background: colorBgContainer }} className="shadow-md shadow-blue-200">
                        {loadingGroups ? (
                            <div className="flex justify-center items-center h-full"><Spin /></div>
                        ) : (
                            <Menu
                                mode="inline"
                                selectedKeys={[location.pathname]}
                                defaultOpenKeys={location.pathname.startsWith('/group') ? ['/group'] : []}
                                style={{ height: '100%', borderRight: 0 }}
                                items={sidebarItems}
                                onClick={handleMenuClick}
                            />
                        )}
                    </Sider>
                    <Layout className="">
                        <Content className="shadow-md shadow-blue-200 m-8 rounded-lg p-6 bg-white">
                            <Outlet />
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
    );
};

export default DashboardLayout;
import { Tabs, Spin } from 'antd';
import ProfileSettings from './ProfileSetting';
import PasswordSettings from './PasswordSetting';
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

const Setting = () => {
    const { user, loading, updateUser } = useContext(UserContext);

    if (loading && !user) {
        return (
            <div className="mt-4 flex justify-center items-center h-96">
                <Spin size="large" />
            </div>
        );
    }
    
    if (!user) {
        return <div>Could not load user data.</div>;
    }

    const items = [
        {
            key: '1',
            label: `Profile`,
            children: <ProfileSettings user={user} onUpdate={updateUser} />,
        },
        {
            key: '2',
            label: `Security`,
            children: <PasswordSettings />,
        },
    ];

    return (
        <div className="mt-4">
            <h1 className="text-2xl font-bold">Account Settings</h1>
            <Tabs defaultActiveKey="1" items={items} />
        </div>
    );
};

export default Setting;
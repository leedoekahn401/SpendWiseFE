import { Modal, Button, Input, notification, List, Avatar, Tag,Card } from 'antd';
import { useState } from 'react';
import instance from '../utils/instance';
import { API_PATH } from '../utils/apiPath';
import { UserPlus } from 'lucide-react';

const InviteModal = ({ visible, onCancel, groupId }) => {
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);

    const handleSearch = async (value) => {
        if (!value || value.trim() === '') {
            setSearchResults([]);
            return;
        }
        setLoading(true);
        try {
            const response = await instance.get(`${API_PATH.INVITE.FIND_USERS}?username=${value}`);
            const newResults = response.data.data.filter(
                user => !selectedMembers.some(selected => selected._id === user._id)
            );
            setSearchResults(newResults);
        } catch (error) {
            notification.error({ message: "No user found" });
        } finally {
            setLoading(false);
        }
    };

    const addMember = (user) => {
        setSelectedMembers(prev => [...prev, user]);
        setSearchResults(prev => prev.filter(result => result._id !== user._id));
    };

    const removeMember = (userId) => {
        const removedMember = selectedMembers.find(member => member._id === userId);
        setSelectedMembers(prev => prev.filter(member => member._id !== userId));
        if (removedMember) setSearchResults(prev => [removedMember, ...prev]);
    };
    
    const handleSendInvites = async () => {
        if (selectedMembers.length === 0) {
            notification.warning({ message: "Please select at least one user to invite." });
            return;
        }
        setSending(true);
        try {
            const inviteesID = selectedMembers.map(m => m._id);
            await instance.post(`${API_PATH.INVITE.SEND_INVITE}`, { inviteesID, groupId });
            setSelectedMembers([]);
            setSearchResults([]);
            onCancel();
        } catch (error) {
             notification.error({ message: error.response?.data?.message || "Cant send invites" });
        } finally {
            setSending(false);
        }
    };

    return (
        <Modal title="Invite new members" open={visible} onCancel={onCancel} footer={[ <Button key="back" onClick={onCancel}>Cancel</Button>, <Button key="submit" type="primary" loading={sending} onClick={handleSendInvites}>Send invites</Button> ]} width={600}>
           <Input.Search placeholder="Search users..." onSearch={handleSearch} loading={loading} enterButton="Search" className="mb-4" />
            <Card className=" rounded-md">
                        <h4 className="font-semibold mb-2 text-gray-600">Selected Members:</h4>
                        <div className="flex flex-wrap gap-2">
                            {selectedMembers.map(member => (
                                <Tag
                                    key={member._id}
                                    closable
                                    onClose={() => removeMember(member._id)}
                                    className="flex items-center gap-2 p-1 text-sm"
                                >
                                    {member.username}
                                </Tag>
                            ))}
                        </div>
                    </Card>
                    <div className = "h-[18vw] overflow-y-scroll no-scrollbar">
                    <List 
                        itemLayout="horizontal"
                        dataSource={searchResults}
                        renderItem={(item) => (
                            <List.Item
                                actions={[
                                    <Button
                                        type="text"
                                        icon={<UserPlus size={18} />}
                                        onClick={() => addMember(item)}
                                    >
                                        Add
                                    </Button>
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar src={item.profilePic} className="bg-gray-200 ring-1 ring-gray-200" size={40} />}
                                    title={item.username}
                                    description={item.email}
                                />
                            </List.Item>
                        )}
                    />
                </div>
        </Modal>
    );
};

export default InviteModal;
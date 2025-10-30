import React, { useState, useEffect } from 'react';
import { Form, Input, Button, List, Avatar, Tag, notification, Empty } from 'antd';
import { UserPlus, Users, Search as SearchIcon, X } from 'lucide-react';
import { API_PATH } from '../../utils/apiPath';
import instance from '../../utils/instance';    

const AddGroup = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);

    useEffect(() => {
        form.setFieldsValue({
            members: selectedMembers.map(member => member._id),
        });
    }, [selectedMembers, form]);

    const handleSearch = async (value) => {
        if (!value || value.trim() === '') {
            setSearchResults([]);
            return;
        }
        setSearching(true);
        try {
            const response = await instance.get(`${API_PATH.INVITE.FIND_USERS}?username=${value}`);
            const newResults = response.data.data.filter(
                user => !selectedMembers.some(selected => selected._id === user._id)
            );
            setSearchResults(newResults);
        } catch (error) {
            notification.error({ message: "Failed to search for users." });
        } finally {
            setSearching(false);
        }
    };

    const addMember = (user) => {
        setSelectedMembers(prev => [...prev, user]);
        setSearchResults(prev => prev.filter(result => result._id !== user._id));
    };

    const removeMember = (userId) => {
        setSelectedMembers(prev => prev.filter(member => member._id !== userId));
    };

    const handleCreateGroup = async (values) => {
        if (selectedMembers.length === 0) {
            notification.warning({ message: 'Please add at least one member to the group.' });
            return;
        }
        setLoading(true);
        try {
            const groupResponse = await instance.post(API_PATH.GROUP.CREATE, { name: values.name, description: values.description });
            const groupId = groupResponse.data.data._id;
            
            await instance.post(API_PATH.INVITE.SEND_INVITE, {
                groupId: groupId,
                inviteesID: values.members
            });

            notification.success({ message: "Group created and invitations sent successfully!" });
            form.resetFields();
            setSelectedMembers([]);
            setSearchResults([]);
            window.location.reload();  
        } catch (error) {
            notification.error({ message: "Failed to create the group. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 mt-6">Create a New Group</h2>
            <div className="bg-white p-8 rounded-sm border border-gray-200 shadow-sm w-full  mx-auto">
                <Form form={form} onFinish={handleCreateGroup} layout="vertical" requiredMark={false}>
                    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-12 mb-8">
                        <div>
                            <Form.Item name="name" label={<span className="font-semibold text-gray-600">Group Name</span>} rules={[{ required: true, message: 'Please enter a name for your group.' }]}>
                                <Input placeholder="e.g., Family Finances" className="py-2.5 px-3.5"/>
                            </Form.Item>

                            <Form.Item name="description" label={<span className="font-semibold text-gray-600">Description</span>}>
                                <Input.TextArea rows={4} placeholder="e.g., For tracking our monthly household expenses." className="py-2.5 px-3.5"/>
                            </Form.Item>
                        </div>
                        <div>
                            <Form.Item name="members" hidden><Input /></Form.Item>
                            <Form.Item label={<span className="font-semibold text-gray-600">Add Members</span>}>
                                <Input.Search
                                    placeholder="Search by username..."
                                    onSearch={handleSearch}
                                    loading={searching}
                                    enterButton={<Button className="!flex !items-center !justify-center"><SearchIcon size={18}/></Button>}
                                    className="mb-4"
                                />
                            </Form.Item>
                            
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[300px] flex flex-col">
                            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><Users size={18}/> Selected Members ({selectedMembers.length})</h3>
                            <div className="flex flex-wrap gap-2 mb-4 border-b pb-4">
                                {selectedMembers.length > 0 ? selectedMembers.map(member => (
                                                    <div
                                                    key={member._id}
                                                    className="flex items-center gap-2 py-1 pl-2 pr-1 text-sm bg-blue-100 text-blue-800 border border-blue-200 rounded-full"
                                                >
                                                    <Avatar src={member.profilePic} size={22}/>
                                                    <span className="font-medium">{member.username}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeMember(member._id)}
                                                        className="p-0.5 rounded-full hover:bg-blue-200 text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                        aria-label={`Remove ${member.username}`}
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                )) : <p className="text-gray-400 text-sm">No members added yet.</p>}
                            </div>
                            <div className="flex-grow overflow-y-auto max-h-[200px]">
                                    <List
                                        itemLayout="horizontal"
                                        dataSource={searchResults}
                                        locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No users found."/>}}
                                        renderItem={(item) => (
                                            <List.Item
                                                className="hover:bg-gray-100 rounded-lg px-2"
                                                actions={[
                                                    <Button type="text" icon={<UserPlus size={18} className="text-blue-600"/>} onClick={() => addMember(item)}/>
                                                ]}
                                            >
                                                <List.Item.Meta
                                                    avatar={<Avatar src={item.profilePic} size={40} />}
                                                    title={<span className="font-semibold">{item.username}</span>}
                                                    description={item.email}
                                                />
                                            </List.Item>
                                        )}
                                    />
                            </div>
                            </div>
                        </div>
                    </div>
                    <Form.Item className="mt-8">
                        <Button type="primary" htmlType="submit" loading={loading} className="w-full h-11 px-8 font-semibold rounded-lg">
                            Create Group
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default AddGroup;


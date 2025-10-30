import { Form, Input, Button, Upload, Avatar, notification, message } from 'antd';
import { User, Mail, UploadCloud } from "lucide-react";
import { UserOutlined } from '@ant-design/icons';
import instance from "../../utils/instance";
import { API_PATH } from "../../utils/apiPath";
import React, { useState, useEffect } from 'react';

const ProfileSettings = ({ user, onUpdate }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                username: user.username,
                email: user.email,
            });
            setPreviewUrl(user.profilePic || null);
        }

        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [user, form]);

    const handleUpdateProfile = async (values) => {
        setLoading(true);
        try {
            let profilePicUrl = user.profilePic;

            if (selectedFile) {
                const formData = new FormData();
                formData.append('avatar', selectedFile);

                const uploadResponse = await instance.post(API_PATH.UPLOAD.AVATAR, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                profilePicUrl = uploadResponse.data.url;
            }

            const updateData = {
                username: values.username,
                email: values.email,
                profilePic: profilePicUrl,
            };

            const response = await instance.put(API_PATH.AUTH.UPDATE_PROFILE, updateData);

            notification.success({
                message: 'Profile Updated',
                description: 'Your profile has been updated successfully.',
            });
            
            if (onUpdate) {
                onUpdate(response.data.user);
                window.location.reload();
            }

            setSelectedFile(null);

            if (profilePicUrl && profilePicUrl !== user.profilePic) {
                setPreviewUrl(profilePicUrl);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            notification.error({
                message: 'Update Failed',
                description: 'There was an error updating your profile.',
            });
        } finally {
            setLoading(false);
        }
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG files!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must be smaller than 2MB!');
        }

        if (isJpgOrPng && isLt2M) {
            const newPreviewUrl = URL.createObjectURL(file);
            setPreviewUrl(newPreviewUrl);
            setSelectedFile(file);
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        }
        return false;
    };

    if (!user) {
        return <div>Loading profile...</div>;
    }

    return (
        <div className="bg-white p-8 rounded-sm border border-gray-200 shadow-sm w-full mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Settings</h2>

            <Form form={form} layout="vertical" onFinish={handleUpdateProfile} requiredMark={false}>
                <Form.Item label={<span className="font-semibold text-gray-600">Your Avatar</span>}>
                    <div className="flex items-center gap-6">
                        <Upload
                            name="avatar"
                            accept="image/png, image/jpeg"
                            showUploadList={false}
                            beforeUpload={beforeUpload}
                        >
                            <div className="relative group cursor-pointer p-1 rounded-full border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors duration-300">
                                <Avatar
                                    size={96}
                                    src={previewUrl}
                                    icon={!previewUrl ? <UserOutlined /> : null}
                                />
                                <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-40 rounded-full flex items-center justify-center transition-opacity duration-300">
                                    <UploadCloud className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={32} />
                                </div>
                            </div>
                        </Upload>
                        <div className="flex flex-col">
                            <span className="font-semibold text-lg text-gray-800">{user.username}</span>
                            <span className="text-gray-500">{user.email}</span>
                        </div>
                    </div>
                </Form.Item>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <Form.Item name="username" label={<span className="font-semibold text-gray-600">Username</span>} rules={[{ required: true, message: 'Please enter your username!' }]}>
                        <Input prefix={<User className="text-gray-400" size={18} />} placeholder="username" className="py-2.5 px-3.5" />
                    </Form.Item>
                    <Form.Item name="email" label={<span className="font-semibold text-gray-600">Email Address</span>} rules={[{ required: true, type: 'email', message: 'Please enter a valid email!' }]}>
                        <Input prefix={<Mail className="text-gray-400" size={18} />} placeholder="user@mail.com" className="py-2.5 px-3.5" />
                    </Form.Item>
                </div>
                
                <Form.Item className="mt-6">
                    <Button type="primary" htmlType="submit" loading={loading} className="w-full md:w-auto h-11 px-8 font-semibold rounded-lg">
                        Update Profile
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ProfileSettings;
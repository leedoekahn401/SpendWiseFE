import { Form, Input, Button } from 'antd';
import instance from "../../utils/instance";
import { API_PATH } from "../../utils/apiPath";
import { useState } from 'react';
import {Lock,ShieldCheck} from "lucide-react";

const PasswordSettings = () => {
    const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (values) => {
    setLoading(true);
    try {
      await instance.put(API_PATH.AUTH.CHANGE_PASSWORD, {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      alert("Change password successfully!");
      form.resetFields();
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Change password failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-sm border border-gray-200 shadow-sm w-full mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Change Password</h2>
      <Form form={form} layout="vertical" onFinish={handleChangePassword} requiredMark={false}>
        <Form.Item
          name="oldPassword"
          label={<span className="font-semibold text-gray-600">Old Password</span>}
          rules={[{ required: true, message: 'Please enter your old password!' }]}
        >
          <Input.Password
            prefix={<Lock className="text-gray-400" size={18} />}
            placeholder="Enter your current password"
            className="py-2.5 px-3.5"
          />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label={<span className="font-semibold text-gray-600">New Password</span>}
          rules={[{ required: true, min: 6, message: 'Password must be at least 6 characters!' }]}
        >
          <Input.Password
            prefix={<ShieldCheck className="text-gray-400" size={18} />}
            placeholder="Enter a new strong password"
            className="py-2.5 px-3.5"
          />
        </Form.Item>
        <Form.Item
          name="confirmNewPassword"
          label={<span className="font-semibold text-gray-600">Confirm New Password</span>}
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Please confirm your new password!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords that you entered do not match!'));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<ShieldCheck className="text-gray-400" size={18} />}
            placeholder="Confirm your new password"
            className="py-2.5 px-3.5"
          />
        </Form.Item>
        <Form.Item className="mt-6">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full md:w-auto h-11 px-8 font-semibold rounded-lg"
          >
            Change Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PasswordSettings;
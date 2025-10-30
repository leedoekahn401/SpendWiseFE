import React from 'react';
import { Input as AntdInput } from 'antd';

const Input = ({ value, onChange, placeholder, type, label }) => {
    return (
        <div className="mb-4">
            {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
            
            {type === 'password' ? (
                <AntdInput.Password
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
            ) : (
                <AntdInput
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
            )}
        </div>
    );
};

export default Input;
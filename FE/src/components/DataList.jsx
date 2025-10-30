import React from 'react';
import { Table, Tag, Empty } from 'antd';

const DataList = ({ data, periodLabel, children }) => {
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const dateObj = new Date(dateString);
        return dateObj.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date) => formatDate(date),
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (text) => text,
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            align: 'right',
            render: (amount, record) => (
                <p className={`font-semibold ${record.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {record.type === 'income' ? '+' : '-'}${amount.toFixed(2)}
                </p>
            ),
        },
    ];

    return (
        <div className="mt-8 p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-lg font-semibold text-gray-700">{`${periodLabel}`}</h3>
                <div className="flex items-center gap-5">
                    {children}
                </div>
            </div>
            
            <Table 
                className="no-scrollbar"
                columns={columns}
                dataSource={data}
                rowKey="_id"
                pagination={false} 
                scroll={{ y: 300 }} 
                locale={{ emptyText: <Empty description="No transaction." /> }}
            />
        </div>
    );
};

export default DataList;


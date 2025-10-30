import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import {Empty} from "antd";
const StackChart = ({ data,title }) => {
    if (!data || data.length === 0) {
        return <Empty description="No data" />;
    }

    return (
        <div className="w-full h-[400px] border border-gray-200 shadow-sm pb-15 rounded-lg pt-6">
            <h3 className="text-xl font-semibold text-center text-gray-700 mb-4">{title}</h3>
            <ResponsiveContainer>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                    <Legend />
                    <Bar dataKey="income" fill="#10b981" name="Thu nhập" />
                    <Bar dataKey="expense" fill="#ef4444" name="Chi tiêu" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default StackChart;
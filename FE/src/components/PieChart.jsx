import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, } from 'recharts';
import { useMemo } from 'react';
import CustomLegend from './CustomLegend';
import {Empty} from 'antd'

const PieChartLayout = ({ data, title }) => {
    if(data.length === 0){
        return (
            <div>
                <h3 className="text-lg font-semibold text-center text-black mb-2">{title}</h3>
                <Empty description="No data"/>
            </div>
        );
    }
    const totalValue = useMemo(() =>
        data.reduce((sum, entry) => sum + entry.amount, 0),[data]
    );

    const Title = title.split(' ')[0];
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    return (
        <div className="w-full h-[300px] border border-gray-200 shadow-sm rounded-lg">
             <h3 className="text-lg font-semibold text-center text-black mb-2">{title}</h3>
            <ResponsiveContainer className="relative">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={115}
                        innerRadius={80}
                        fill="#8884d8"
                        dataKey="amount"
                        nameKey="category"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                    <Legend content={<CustomLegend />} />
                    {
                        totalValue > 0 && (
                            <>
                                <text x="50%" y="50%" dy={-25} textAnchor="middle" dominantBaseline="middle" className="text-lg font-semibold text-gray-600">Total {Title}</text>
                                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-lg font-semibold text-gray-600">${Math.round(totalValue)}</text>
                            </>
                        )
                    }
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PieChartLayout;
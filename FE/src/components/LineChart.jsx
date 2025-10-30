import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-2 bg-white border border-gray-300 rounded-lg shadow-lg">
                <p className="font-semibold text-gray-700">{`Date: ${label}`}</p>
                {payload.map((pld, index) => (
                    <div key={index} style={{ color: pld.stroke }}>
                        <span className="capitalize">{pld.dataKey}: </span>
                        <strong>${pld.value.toFixed(2)}</strong>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const LineChartLayout = ({ data, titles, children }) => {
    const colors = {
        surplus: "#4f46e5", 
        income: "#10b981", 
        expense: "#ef4444", 
    };

    const lines = (items) => {
        return items.map((item) => {
            const color = colors[item.dataKey] || "#8884d8"; 
            return (
                <Line
                    key={item.dataKey}
                    type="monotone"
                    dataKey={item.dataKey}
                    stroke={color}
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                    dot={{ r: 3, strokeWidth: 1, fill: '#fff' }}
                />
            );
        });
    };


    const formatLegend = (value) => {
        return value.charAt(0).toUpperCase() + value.slice(1);
    };

    return (
        <div className="flex items-center justify-center flex-col w-[100%] h-[500px] border border-gray-200 shadow-sm pb-2 rounded-lg px-8">
            <div className="flex items-center justify-between w-full mt-6 ">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Financial Overview</h2>
                {children}
            </div>
            <ResponsiveContainer className="overflow-visible">
                <LineChart
                    data={data}
    
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="date" interval="preserveStartEnd" tick={{ fill: '#6b7280' }} />
                    <YAxis tickFormatter={(value) => `$${value}`} tick={{ fill: '#6b7280' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend formatter={formatLegend} />
                    {lines(titles)}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LineChartLayout;
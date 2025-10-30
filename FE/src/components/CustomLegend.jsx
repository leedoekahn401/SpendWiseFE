import React from 'react';

const CustomLegend = ({payload}) => {
    return (
        <ul className="flex justify-center flex-wrap mt-4 list-none p-0">
            {payload.map((entry, index) => (
                <li key={`item-${index}`} className="flex items-center mr-4 mb-2">
                    <span className="w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                    <span className="text-sm text-gray-600">{entry.value}</span>
                </li>
            ))}
        </ul>
    );
};

export default CustomLegend;
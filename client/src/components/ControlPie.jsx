import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, Label } from 'recharts';

const ControlPie = ({ total, completed, partial = 0, completion }) => {
    const failed = Math.max(0, total - completed - partial);

    const data = [
        { name: 'Ferdig', value: completed, color: '#38A169' },
        { name: 'Delvis', value: partial, color: '#9333ea' },
        { name: 'Krever tiltak', value: failed, color: '#E53E3E' }
    ];

    const activeData = data.filter(item => item.value > 0);

    return (
        <div style={{ width: '100%', height: '100%', minHeight: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={activeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        cornerRadius={5}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                    >
                        {activeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}

                        <Label
                            value={completion}
                            position="center"
                            style={{
                                fontSize: '22px',
                                fontWeight: '700',
                                fill: '#1f2937',
                                fontFamily: 'Inter, sans-serif'
                            }}
                        />
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            border: 'none',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            fontSize: '12px',
                            padding: '8px 12px'
                        }}
                        itemStyle={{ color: '#374151' }}
                        cursor={false}
                    />
                    <Legend
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{ right: 0 }}
                        formatter={(value) => (
                            <span style={{
                                color: '#4b5563',
                                fontSize: '13px',
                                marginLeft: '6px',
                                fontWeight: 500,
                            }}>
                                {value}
                            </span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ControlPie;
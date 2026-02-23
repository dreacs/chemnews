'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

export default function TrendChart({ data }) {
    // data format expected: [{ name: 'Feb 3', Bullish: 4, Bearish: 2, Neutral: 5 }, ...]

    if (!data || data.length === 0) {
        return (
            <div className="flex h-64 items-center justify-center p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm mb-8">
                <p className="text-gray-500 dark:text-gray-400">Waiting for trend data...</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm mb-8">
            <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-gray-100">Sentiment Trend</h2>
            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                        <XAxis dataKey="name" tick={{ fill: '#6B7280' }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fill: '#6B7280' }} tickLine={false} axisLine={false} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Bar dataKey="Bullish" stackId="a" fill="#10B981" radius={[0, 0, 4, 4]} />
                        <Bar dataKey="Bearish" stackId="a" fill="#EF4444" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="Neutral" stackId="a" fill="#6B7280" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

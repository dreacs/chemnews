"use client";

import { useMemo } from "react";
import { format, parseISO, eachDayOfInterval, startOfDay } from "date-fns";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

interface Signal {
    id: string;
    sentiment: 'Bullish' | 'Bearish' | 'Neutral';
    published_at: string;
}

export function SentimentChart({ signals }: { signals: Signal[] }) {
    const chartData = useMemo(() => {
        // Determine the start date: explicitly Feb 3, 2026, or use last 14 days
        const startDate = new Date(2026, 1, 3); // Month is 0-indexed (1 = Feb)
        const endDate = new Date();

        // Safety fallback just in case current date is before Feb 3rd or far in future
        // In production we usually do `subDays(new Date(), 14)`
        const daysInterval = eachDayOfInterval({
            start: startDate > endDate ? endDate : startDate,
            end: endDate,
        });

        const dataMap: Record<string, { date: string; Bullish: number; Bearish: number; Neutral: number; sortDate: Date }> = {};

        daysInterval.forEach(day => {
            const key = format(day, "MMM dd");
            dataMap[key] = { date: key, Bullish: 0, Bearish: 0, Neutral: 0, sortDate: day };
        });

        signals.forEach(signal => {
            const dateKey = format(startOfDay(parseISO(signal.published_at)), "MMM dd");
            if (dataMap[dateKey] && signal.sentiment) {
                dataMap[dateKey][signal.sentiment] += 1;
            }
        });

        return Object.values(dataMap).sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime());
    }, [signals]);

    return (
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 h-80 w-full mb-6 relative">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">14-Day Sentiment Trend</h3>
            <div className="h-64 absolute bottom-6 inset-x-6">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip
                            contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", color: "#f8fafc", borderRadius: "8px" }}
                            itemStyle={{ color: "#f8fafc" }}
                        />
                        <Legend wrapperStyle={{ paddingTop: "10px" }} />
                        <Bar dataKey="Bullish" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                        <Bar dataKey="Neutral" stackId="a" fill="#64748b" />
                        <Bar dataKey="Bearish" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

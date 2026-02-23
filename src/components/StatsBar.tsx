"use client";

import { useMemo } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export function StatsBar({ signals }: { signals: any[] }) {
    // Filter for today's signals only
    const today = new Date().toISOString().split("T")[0];
    const todaysSignals = useMemo(() => {
        return signals.filter(s => s.published_at.startsWith(today));
    }, [signals, today]);

    const total = todaysSignals.length;
    const bullish = todaysSignals.filter(s => s.sentiment === 'Bullish').length;
    const bearish = todaysSignals.filter(s => s.sentiment === 'Bearish').length;
    const neutral = todaysSignals.filter(s => s.sentiment === 'Neutral').length;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center">
                <p className="text-slate-400 text-sm font-medium">Articles Today</p>
                <p className="text-3xl font-bold mt-1 text-slate-100">{total}</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700/50 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-20"><TrendingUp size={40} className="text-emerald-500" /></div>
                <p className="text-slate-400 text-sm font-medium z-10">Bullish</p>
                <p className="text-3xl font-bold mt-1 text-emerald-500 z-10">{bullish}</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700/50 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-20"><TrendingDown size={40} className="text-red-500" /></div>
                <p className="text-slate-400 text-sm font-medium z-10">Bearish</p>
                <p className="text-3xl font-bold mt-1 text-red-500 z-10">{bearish}</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700/50 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-20"><Minus size={40} className="text-slate-400" /></div>
                <p className="text-slate-400 text-sm font-medium z-10">Neutral</p>
                <p className="text-3xl font-bold mt-1 text-slate-300 z-10">{neutral}</p>
            </div>
        </div>
    );
}

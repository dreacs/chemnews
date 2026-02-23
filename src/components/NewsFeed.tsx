"use client";

import { useMemo } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { MoveUpRight, MoveDownRight, Minus, ShieldAlert, Zap, Box } from "lucide-react";
import { cn } from "@/lib/utils";

const tagColors: Record<string, string> = {
    "Acetone": "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    "Ammonia": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    "Methanol": "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20",
    "Caustic Soda": "bg-amber-500/10 text-amber-400 border-amber-500/20",
    "Brent Crude Oil": "bg-stone-500/10 text-stone-400 border-stone-500/20",
};

export function NewsFeed({ signals }: { signals: any[] }) {
    const sortedSignals = useMemo(() => {
        return [...signals].sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
    }, [signals]);

    if (sortedSignals.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                <Box className="w-12 h-12 mb-4 opacity-50" />
                <p>No signals found for the selected filter.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {sortedSignals.map((signal) => (
                <a
                    key={signal.id}
                    href={signal.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl p-5 transition-all group"
                >
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-3">
                        <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-sm font-medium text-slate-400 flex items-center gap-1.5">
                                <Zap size={14} className="text-yellow-500" />
                                {signal.source}
                            </span>
                            <span className="text-slate-600">•</span>
                            <span className="text-sm text-slate-500">
                                {formatDistanceToNow(parseISO(signal.published_at), { addSuffix: true })}
                            </span>
                        </div>

                        <div className="flex gap-2">
                            <span className={cn(
                                "px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1",
                                signal.sentiment === 'Bullish' ? "bg-emerald-500/10 text-emerald-400" :
                                    signal.sentiment === 'Bearish' ? "bg-red-500/10 text-red-400" :
                                        "bg-slate-500/10 text-slate-400"
                            )}>
                                {signal.sentiment === 'Bullish' && <MoveUpRight size={14} />}
                                {signal.sentiment === 'Bearish' && <MoveDownRight size={14} />}
                                {signal.sentiment === 'Neutral' && <Minus size={14} />}
                                {signal.sentiment}
                            </span>

                            {signal.confidence_score >= 0.8 && (
                                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
                                    <ShieldAlert size={14} />
                                    High Confidence
                                </span>
                            )}
                        </div>
                    </div>

                    <h3 className="text-lg font-semibold text-slate-200 group-hover:text-primary transition-colors leading-tight mb-2">
                        {signal.title}
                    </h3>

                    <p className="text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {signal.content_summary}
                    </p>

                    <div className="flex gap-2 flex-wrap">
                        {signal.commodity_tags?.map((tag: string) => (
                            <span
                                key={tag}
                                className={cn(
                                    "px-2 py-1 text-xs rounded-full border",
                                    tagColors[tag] || "bg-slate-700 text-slate-300 border-slate-600"
                                )}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </a>
            ))}
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { StatsBar } from "@/components/StatsBar";
import { SentimentChart } from "@/components/SentimentChart";
import { NewsFeed } from "@/components/NewsFeed";
import { Activity, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const COMMODITIES = ["All", "Acetone", "Ammonia", "Methanol", "Caustic Soda", "Brent Crude Oil"];

export default function Dashboard() {
    const [signals, setSignals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchSignals = async () => {
        setIsRefreshing(true);
        let query = supabase.from("signals").select("*").order("published_at", { ascending: false }).limit(100);

        if (filter !== "All") {
            query = query.contains("commodity_tags", [filter]);
        }

        const { data, error } = await query;
        if (error) {
            console.error("Error fetching signals:", error);
        } else {
            setSignals(data || []);
        }
        setLoading(false);
        setTimeout(() => setIsRefreshing(false), 500);
    };

    useEffect(() => {
        fetchSignals();
    }, [filter]);

    // Real-time subscription
    useEffect(() => {
        const channel = supabase
            .channel("schema-db-changes")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "signals" },
                (payload) => {
                    // Check if new payload matches current filter
                    if (filter === "All" || payload.new.commodity_tags?.includes(filter)) {
                        setSignals((prev) => [payload.new, ...prev]);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [filter]);

    return (
        <main className="max-w-6xl mx-auto px-4 py-8">
            {/* Global Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
                        <Activity className="text-primary" size={32} />
                        ChemSignal
                    </h1>
                    <p className="text-slate-400 mt-1">Real-time raw material price intelligence.</p>
                </div>

                <button
                    onClick={fetchSignals}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg border border-slate-700 transition-all font-medium text-sm"
                >
                    <RefreshCcw size={16} className={cn(isRefreshing && "animate-spin")} />
                    Refresh Now
                </button>
            </header>

            {/* Commodity Filters */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
                {COMMODITIES.map((c) => (
                    <button
                        key={c}
                        onClick={() => setFilter(c)}
                        className={cn(
                            "px-4 py-2 rounded-full whitespace-nowrap font-medium text-sm transition-all border",
                            filter === c
                                ? "bg-primary text-white border-primary"
                                : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white"
                        )}
                    >
                        {c}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <RefreshCcw className="animate-spin text-primary opacity-50" size={32} />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column (Chart + Stats) */}
                    <div className="lg:col-span-1 space-y-6">
                        <StatsBar signals={signals} />
                        <SentimentChart signals={signals} />
                    </div>

                    {/* Right Column (News Feed) */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                Live Signals Tracker
                            </h2>
                            <span className="text-sm font-medium bg-slate-800 px-3 py-1 rounded-full text-slate-400 border border-slate-700">
                                {signals.length} Updates
                            </span>
                        </div>

                        {/* Scrollable Feed */}
                        <div className="h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                            <NewsFeed signals={signals} />
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

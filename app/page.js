'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import StatsBar from '../components/StatsBar';
import TrendChart from '../components/TrendChart';
import IntelligenceFeed from '../components/IntelligenceFeed';

export default function Home() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState({ totalToday: 0, bullish: 0, bearish: 0, neutral: 0 });
  const [chartData, setChartData] = useState([]);
  const [articles, setArticles] = useState([]);

  // Mock data for UI development before DB is wired up
  useEffect(() => {
    setStats({ totalToday: 12, bullish: 5, bearish: 3, neutral: 4 });
    setChartData([
      { name: 'Feb 3', Bullish: 4, Bearish: 2, Neutral: 5 },
      { name: 'Feb 4', Bullish: 3, Bearish: 4, Neutral: 3 },
      { name: 'Feb 5', Bullish: 6, Bearish: 1, Neutral: 4 },
      { name: 'Feb 6', Bullish: 2, Bearish: 5, Neutral: 2 },
      { name: 'Feb 7', Bullish: 5, Bearish: 3, Neutral: 4 },
    ]);
    setArticles([
      {
        id: 1,
        source: 'PlasticsToday',
        title: 'Acetone Prices Hit New Highs Amidst Supply Chain Constraints',
        summary: 'Major producers have announced immediate price hikes for acetone following unexpected turnaround operations at two key facilities in Europe. Short-term supply is expected to remain tight.',
        commodity_tag: 'Acetone',
        impact_badge: 'Bullish',
        confidence_score: 92,
        publish_date: new Date().toISOString()
      },
      {
        id: 2,
        source: 'PlasticsToday',
        title: 'European Ammonia Demand Softens in Q1',
        summary: 'Despite stable natural gas prices, industrial demand for ammonia in the Eurozone has seen a slight decline compared to the previous quarter, leading to a build-up in localized inventory.',
        commodity_tag: 'Ammonia',
        impact_badge: 'Bearish',
        confidence_score: 85,
        publish_date: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 3,
        source: 'PlasticsToday',
        title: 'Regulatory Review on Chemical Imports Stalls',
        summary: 'The proposed tariffs on specific chemical imports have been delayed until the next legislative session, maintaining the status quo for current trades.',
        commodity_tag: 'General',
        impact_badge: 'Neutral',
        confidence_score: 78,
        publish_date: new Date(Date.now() - 7200000).toISOString()
      }
    ]);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // TODO: Call /api/ingest
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  return (
    <main>
      <Header onRefresh={handleRefresh} isRefreshing={isRefreshing} />

      <StatsBar stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <TrendChart data={chartData} />
        </div>
        <div className="lg:col-span-1">
          <IntelligenceFeed articles={articles} />
        </div>
      </div>
    </main>
  );
}

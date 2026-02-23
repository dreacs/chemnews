// app/page.js
'use client';
import { useEffect, useState } from 'react';
import Timeline from '../components/Timeline';
import CalendarTimeline from '../components/CalendarTimeline';

export default function Dashboard() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Auto-refresh mechanism
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const [filter, setFilter] = useState('All');
  const [selectedDate, setSelectedDate] = useState(null);

  const chemicals = ['All', 'Ammonia', 'Acetone', 'Methanol', 'Caustic Soda', 'Brent Crude'];

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/fetch-news');
      const json = await res.json();
      if (json.success) {
        setNews(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch news', err);
    } finally {
      setLoading(false);
      setLastUpdate(new Date());
    }
  };

  useEffect(() => {
    fetchNews();

    // Poll every 30 minutes (30 * 60 * 1000 ms)
    const intervalId = setInterval(fetchNews, 1800000);
    return () => clearInterval(intervalId);
  }, []);

  const filteredNews = filter === 'All' ? news : news.filter(n => n.chemical === filter);

  // Double filter context (Material + Date)
  const finalFilteredNews = selectedDate
    ? filteredNews.filter(n => new Date(n.timeReleased).toLocaleDateString() === selectedDate)
    : filteredNews;

  return (
    <main className="dashboard-layout">
      <header className="dashboard-header animate-fade-in">
        <h1>ChemMarket Intel</h1>
        <p>Real-time AI sentiment analysis for European petrochemical markets</p>
        <div style={{ marginTop: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Last Updated: {lastUpdate.toLocaleTimeString()}
          <button
            onClick={fetchNews}
            style={{
              marginLeft: '12px', background: 'var(--glass-border)', color: 'white',
              border: 'none', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer'
            }}
          >
            Refresh
          </button>
        </div>

        {/* Filter Bar */}
        <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {chemicals.map(chem => (
            <button
              key={chem}
              onClick={() => setFilter(chem)}
              style={{
                background: filter === chem ? 'var(--accent-blue)' : 'var(--glass-border)',
                color: 'white', border: 'none', padding: '8px 16px', borderRadius: '20px',
                cursor: 'pointer', fontWeight: 500, transition: 'background 0.2s'
              }}
            >
              {chem}
            </button>
          ))}
        </div>
      </header>

      {!loading && news.length > 0 && (
        <CalendarTimeline
          data={filteredNews}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
      )}

      {loading && news.length === 0 ? (
        <div className="glass-panel animate-fade-in" style={{ textAlign: 'center' }}>
          <p>Loading market intelligence & 60-day historical data...</p>
        </div>
      ) : (
        <Timeline data={finalFilteredNews} />
      )}
    </main>
  );
}

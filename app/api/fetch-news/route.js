// app/api/fetch-news/route.js
import { NextResponse } from 'next/server';
import { analyzeSentiment, generateHistoricalData } from '../../../lib/ai';

// In-memory store
let cachedNews = [];
let lastFetched = null;

// Mock fallback if gemini key is missing or fails entirely
const MOCK_HEADLINES = [
    { chemical: 'Ammonia', headline: 'European Ammonia prices surge amidst tight supply from Middle East', link: 'https://www.icis.com/explore/commodities/fertilizers/ammonia/' },
    { chemical: 'Acetone', headline: 'Acetone demand remains weak in European spot market', link: 'https://www.icis.com/explore/commodities/chemicals/phenol-and-acetone/' },
    { chemical: 'Methanol', headline: 'Methanol contract prices roll over into new quarter', link: 'https://www.argusmedia.com/en/chemicals/argus-methanol' },
    { chemical: 'Caustic Soda', headline: 'EuroChlor reports steady Chlor-alkali operating rates', link: 'https://www.eurochlor.org/news/' },
    { chemical: 'Brent Crude', headline: 'Brent Crude futures climb above $85 on OPEC+ extension hopes', link: 'https://www.reuters.com/markets/commodities/' }
];

export async function GET() {
    const now = new Date();

    if (lastFetched && (now.getTime() - lastFetched.getTime() < 30 * 60 * 1000) && cachedNews.length > 0) {
        return NextResponse.json({ success: true, cached: true, data: cachedNews });
    }

    try {
        let newItems = [];

        // If the cache is completely empty, generate 60 days of historical data
        if (cachedNews.length === 0) {
            const historyItems = await generateHistoricalData(60);

            if (historyItems && historyItems.length > 0) {
                newItems = historyItems.map(item => ({
                    chemical: item.chemical,
                    headline: item.headline,
                    link: item.link || '#',
                    timeReleased: new Date(now.getTime() - (item.timeOffsetDays || 0) * 86400000).toISOString(),
                    sentiment: item.sentiment,
                    confidence: item.confidence,
                    impact: item.impact
                }));
            }
        }

        // If we couldn't generate historical data, fallback to basic mock generator
        if (newItems.length === 0 && cachedNews.length === 0) {
            for (const item of MOCK_HEADLINES) {
                const timeReleased = new Date(now.getTime() - Math.random() * 86400000).toISOString();
                const analysis = await analyzeSentiment(item.headline, '');

                newItems.push({
                    chemical: item.chemical,
                    headline: item.headline,
                    link: item.link,
                    timeReleased,
                    sentiment: analysis.sentiment,
                    confidence: analysis.confidence,
                    impact: analysis.impact
                });
            }
        }

        const existingPushed = cachedNews.filter(n => n.pushedByUser);
        // Merge new generated items and existing pushed items, skipping duplicates by headline
        const mergedNews = [...existingPushed, ...newItems, ...cachedNews.filter(n => !n.pushedByUser)];

        // Remove duplicates
        const uniqueNewsMap = new Map();
        mergedNews.forEach(item => uniqueNewsMap.set(item.headline, item));
        cachedNews = Array.from(uniqueNewsMap.values()).sort((a, b) => new Date(b.timeReleased) - new Date(a.timeReleased));

        lastFetched = now;

        return NextResponse.json({ success: true, cached: false, data: cachedNews });

    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// Allow manual injection of scraped articles for verification testing
export async function POST(req) {
    try {
        const body = await req.json();
        const { chemical, headline, link, snippet } = body;

        const analysis = await analyzeSentiment(headline, snippet);

        const newItem = {
            chemical,
            headline,
            link: link || '#',
            timeReleased: new Date().toISOString(),
            sentiment: analysis.sentiment,
            confidence: analysis.confidence,
            impact: analysis.impact,
            pushedByUser: true // flag to ensure it isn't overwritten by periodic refresh
        };

        // Add to top of cache
        cachedNews.unshift(newItem);

        return NextResponse.json({ success: true, data: newItem });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

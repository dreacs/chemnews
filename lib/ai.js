// lib/ai.js
export async function analyzeSentiment(headline, snippet) {
    const prompt = `Analyze the following petrochemical market news for its price and supply impact on the European market.
Headline: ${headline}
Snippet: ${snippet || ''}

Respond STRICTLY in JSON format with the following keys:
- "sentiment": Exactly one of "Bullish", "Bearish", or "Neutral"
- "confidence": An integer between 0 and 100
- "impact": A very concise 1-sentence summary of the market impact.

JSON Response:`;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return getMockSentiment(headline, snippet);
    }

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.1,
                    responseMimeType: 'application/json'
                }
            })
        });

        if (!res.ok) {
            const errText = await res.text();
            console.error('[AI Service Response Error]:', errText);
            throw new Error(`API Error: ${res.status} ${res.statusText} - ${errText}`);
        }

        const data = await res.json();
        const textRes = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
        const jsonStr = textRes.replace(/```json/gi, '').replace(/```/g, '').trim();

        return JSON.parse(jsonStr);
    } catch (error) {
        console.error('[AI Service] Error parsing sentiment:', error);
        return getMockSentiment(headline, snippet);
    }
}

function getMockSentiment(headline, snippet) {
    let mockSentiment = 'Neutral';
    const text = (headline + ' ' + (snippet || '')).toLowerCase();

    if (text.includes('surge') || text.includes('increase') || text.includes('shortage') || text.includes('high') || text.includes('tight')) {
        mockSentiment = 'Bullish';
    } else if (text.includes('drop') || text.includes('decrease') || text.includes('weak') || text.includes('low') || text.includes('fall')) {
        mockSentiment = 'Bearish';
    }

    return {
        sentiment: mockSentiment,
        confidence: Math.floor(Math.random() * 20) + 75,
        impact: `[MOCK AI] Pricing expected to trend ${mockSentiment.toLowerCase()} based on current supply-demand indicators.`
    };
}

export async function generateHistoricalData(days) {
    const prompt = `Generate a JSON array of 30 realistic news headlines for the European petrochemical and energy market (specifically covering Ammonia, Acetone, Methanol, Caustic Soda, and Brent Crude) spread over the last ${days} days.
For each item, include exactly these keys:
- "chemical": The chemical or material name ("Ammonia", "Acetone", "Methanol", "Caustic Soda", or "Brent Crude")
- "headline": A realistic market news headline
- "link": A dummy link (e.g., 'https://www.reuters.com/markets/commodities/123')
- "sentiment": "Bullish", "Bearish", or "Neutral"
- "confidence": Integer 70-100 indicating confidence
- "impact": 1-sentence market impact summary
- "timeOffsetDays": Float between 0 and ${days} representing how many days ago it happened (e.g. 2.5 means 2.5 days ago)

Return EXACTLY a JSON array, nothing else.`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return [];

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.7,
                    responseMimeType: 'application/json'
                }
            })
        });

        if (!res.ok) throw new Error('API failed');
        const data = await res.json();
        const textRes = data?.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
        return JSON.parse(textRes.replace(/```json/gi, '').replace(/```/g, '').trim());
    } catch (error) {
        console.error('[AI Service] History Error:', error);
        return [];
    }
}

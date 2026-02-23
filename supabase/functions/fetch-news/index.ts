import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from "npm:@supabase/supabase-js@2.39.3";
import Parser from "npm:rss-parser@3.13.0";

const parser = new Parser();

// The news sources we want to parse
const FEEDS = [
  { source: "Reuters", url: "https://www.reuters.com/arc/outboundfeeds/rss/category/business/energy/" },
  { source: "OilPrice", url: "https://oilprice.com/rss/main" },
  { source: "PlasticsToday", url: "https://www.plasticstoday.com/rss.xml" },
  { source: "Google News - Acetone", url: "https://news.google.com/rss/search?q=Acetone+price+OR+production+when:24h&hl=en-US" },
  { source: "Google News - Ammonia", url: "https://news.google.com/rss/search?q=Ammonia+market+OR+supply+when:24h&hl=en-US" },
  { source: "Google News - Methanol", url: "https://news.google.com/rss/search?q=Methanol+spot+price+OR+plant+when:24h&hl=en-US" },
  { source: "Google News - Caustic Soda", url: "https://news.google.com/rss/search?q=Caustic+Soda+OR+Chlor-alkali+market+when:24h&hl=en-US" },
  { source: "Google News - Brent Crude", url: "https://news.google.com/rss/search?q=Brent+Crude+Oil+OPEC+when:24h&hl=en-US" },
];

Deno.serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY') ?? '';
    
    if (!supabaseUrl || !supabaseKey || !geminiApiKey) {
      throw new Error("Missing required environment variables.");
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const allNews: any[] = [];
    
    // 1. Fetch RSS Feeds
    for (const feed of FEEDS) {
      try {
        const feedData = await parser.parseURL(feed.url);
        // Only take latest 3 per feed to avoid huge processing batches during cron
        const items = feedData.items.slice(0, 3); 
        for (const item of items) {
          if (item.title && item.link) {
            allNews.push({
              title: item.title,
              link: item.link,
              source: feed.source,
              published_at: item.isoDate || item.pubDate || new Date().toISOString()
            });
          }
        }
      } catch (e) {
        console.error(`Error fetching feed ${feed.source}:`, e);
      }
    }
    
    if (allNews.length === 0) {
      return new Response(JSON.stringify({ message: "No news fetched." }), { headers: { "Content-Type": "application/json" }});
    }

    // 2. Check for duplicates in the DB
    const links = allNews.map(n => n.link);
    const { data: existingRecords, error: dbError } = await supabase
      .from('signals')
      .select('link')
      .in('link', links);
      
    if (dbError) throw dbError;
    
    const existingLinks = new Set(existingRecords?.map(r => r.link));
    const newArticles = allNews.filter(n => !existingLinks.has(n.link));
    
    if (newArticles.length === 0) {
      return new Response(JSON.stringify({ message: "No new articles to process." }), { headers: { "Content-Type": "application/json" }});
    }

    // 3. Batch Process with Gemini
    const newArticlesBatched = newArticles.slice(0, 10); // Batch up to 10 to stay within limits
    
    const promptText = `
Analyze the following news headlines. For each, identify the primary commodity (strict choices: "Acetone", "Ammonia", "Methanol", "Caustic Soda", "Brent Crude Oil"). 
Categorize market sentiment as "Bullish", "Bearish", or "Neutral".
Provide a 1-sentence summary of the market impact.
Assign a confidence score (0.0 to 1.0). 
Return the result STRICTLY as a JSON array format matching this structure:
[
  {
    "link": "URL of the article (must match exactly the input)",
    "commodity_tags": ["Ammonia"], // Array containing standard commodity names
    "sentiment": "Bullish", // Bullish, Bearish, or Neutral
    "content_summary": "1 sentence explanation.",
    "confidence_score": 0.85
  }
]

Articles to analyze:
${JSON.stringify(newArticlesBatched.map(a => ({ title: a.title, link: a.link, source: a.source })), null, 2)}
    `;

    // Call Gemini API (using generateContent)
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;
    
    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: { response_mime_type: "application/json" } // Ensures JSON output
      })
    });
    
    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      console.error("Gemini Error:", errText);
      throw new Error("Failed to analyze with Gemini");
    }

    const geminiData = await geminiResponse.json();
    let resultText = geminiData.candidates[0].content.parts[0].text;
    
    let aiResults;
    try {
      aiResults = JSON.parse(resultText);
    } catch (e) {
      console.error("Failed to parse Gemini output:", resultText);
      throw new Error("Gemini output was not valid JSON");
    }

    // 4. Merge AI results with original news items and save to DB
    const insertData = [];
    for (const ai of aiResults) {
      const original = newArticlesBatched.find(a => a.link === ai.link);
      if (original) {
        insertData.push({
          title: original.title,
          link: original.link,
          source: original.source,
          published_at: new Date(original.published_at).toISOString(),
          content_summary: ai.content_summary,
          sentiment: ai.sentiment,
          confidence_score: ai.confidence_score,
          commodity_tags: ai.commodity_tags
        });
      }
    }

    if (insertData.length > 0) {
      const { error: insertError } = await supabase
        .from('signals')
        .insert(insertData);
        
      if (insertError) {
        console.error("DB Insert Error:", insertError);
        throw insertError;
      }
    }

    return new Response(JSON.stringify({ 
      processed: newArticlesBatched.length, 
      inserted: insertData.length,
      message: "Success"
    }), { headers: { "Content-Type": "application/json" } });

  } catch (error: any) {
    console.error("Edge Function Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
});

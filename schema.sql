-- Create an ENUM for sentiment
CREATE TYPE sentiment_type AS ENUM ('Bullish', 'Bearish', 'Neutral');

-- Create the signals table
CREATE TABLE signals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    link TEXT UNIQUE NOT NULL, -- Unique prevents inserting duplicate news articles
    source TEXT NOT NULL,
    content_summary TEXT NOT NULL,
    sentiment sentiment_type NOT NULL,
    confidence_score NUMERIC(3,2) CHECK (confidence_score >= 0.0 AND confidence_score <= 1.0) NOT NULL,
    commodity_tags TEXT[] NOT NULL, 
    published_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for descending chronological queries
CREATE INDEX idx_signals_published_at ON signals(published_at DESC);

-- Index for array filtering (optimizes filtering by specific commodities)
CREATE INDEX idx_signals_commodity_tags ON signals USING GIN (commodity_tags);

-- Enable Supabase Realtime for this table
alter publication supabase_realtime add table signals;

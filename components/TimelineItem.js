// components/TimelineItem.js
export default function TimelineItem({ item }) {
    const { chemical, sentiment, confidence, timeReleased, link, impact, headline } = item;

    let sentimentColor = 'var(--bg-dark)';
    let tagClass = 'neutral';

    if (sentiment?.toLowerCase().includes('bull')) {
        tagClass = 'bullish';
        sentimentColor = 'var(--bullish)';
    } else if (sentiment?.toLowerCase().includes('bear')) {
        tagClass = 'bearish';
        sentimentColor = 'var(--bearish)';
    } else {
        tagClass = 'neutral';
        sentimentColor = 'var(--neutral)';
    }

    return (
        <div className={`timeline-item ${tagClass} glass-panel animate-fade-in`}>
            <div className="timeline-marker" style={{ borderColor: sentimentColor }}></div>
            <div className="timeline-content">
                <div className="timeline-header">
                    <span className="chemical-badge">{chemical}</span>
                    <span className="time-stamp">{new Date(timeReleased).toLocaleDateString()} {new Date(timeReleased).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <h3 className="headline"><a href={link || '#'} target="_blank" rel="noopener noreferrer">{headline}</a></h3>
                <p className="impact-text">{impact}</p>
                <div className="meta-footer">
                    <span className={`sentiment-tag ${tagClass}`}>{sentiment || 'Neutral'}</span>
                    <span className="confidence-score">{confidence}% Confidence</span>
                </div>
            </div>
        </div>
    );
}

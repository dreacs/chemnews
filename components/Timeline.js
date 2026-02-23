// components/Timeline.js
import TimelineItem from './TimelineItem';

export default function Timeline({ data }) {
    if (!data || data.length === 0) {
        return <div className="glass-panel empty-state">No market intelligence updates available.</div>;
    }

    return (
        <div className="timeline-container">
            {data.map((item, idx) => (
                <TimelineItem key={idx} item={item} />
            ))}
        </div>
    );
}

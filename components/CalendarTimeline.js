// components/CalendarTimeline.js
export default function CalendarTimeline({ data, selectedDate, onSelectDate }) {
    if (!data || data.length === 0) return null;

    // Group data by date
    const dateMap = new Map();

    data.forEach(item => {
        const d = new Date(item.timeReleased);
        const dateStr = d.toLocaleDateString();

        if (!dateMap.has(dateStr)) {
            dateMap.set(dateStr, {
                dateStr,
                dateObj: d,
                bullish: 0,
                bearish: 0,
                neutral: 0,
                total: 0
            });
        }

        const count = dateMap.get(dateStr);
        count.total += 1;

        if (item.sentiment?.toLowerCase().includes('bull')) {
            count.bullish += 1;
        } else if (item.sentiment?.toLowerCase().includes('bear')) {
            count.bearish += 1;
        } else {
            count.neutral += 1;
        }
    });

    const sortedDates = Array.from(dateMap.values()).sort((a, b) => b.dateObj - a.dateObj);

    return (
        <div className="calendar-timeline-container animate-fade-in">
            <div className="calendar-timeline-header">
                <h3>News by Date</h3>
                {selectedDate && (
                    <button className="clear-filter-btn" onClick={() => onSelectDate(null)}>
                        Clear Filter
                    </button>
                )}
            </div>
            <div className="calendar-scroll">
                {sortedDates.map((day) => {
                    const isSelected = selectedDate === day.dateStr;

                    return (
                        <div
                            key={day.dateStr}
                            className={`calendar-day-card glass-panel ${isSelected ? 'selected' : ''}`}
                            onClick={() => onSelectDate(day.dateStr)}
                        >
                            <div className="day-date">{day.dateStr}</div>
                            <div className="day-stats">
                                {day.bullish > 0 && <span className="stat bullish" title="Bullish">{day.bullish}</span>}
                                {day.bearish > 0 && <span className="stat bearish" title="Bearish">{day.bearish}</span>}
                                {day.neutral > 0 && <span className="stat neutral" title="Neutral">{day.neutral}</span>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

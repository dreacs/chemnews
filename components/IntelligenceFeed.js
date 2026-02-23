import { formatDistanceToNow } from 'date-fns';

export default function IntelligenceFeed({ articles }) {
    if (!articles || articles.length === 0) {
        return (
            <div className="flex h-32 items-center justify-center p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
                <p className="text-gray-500 dark:text-gray-400">Listening to the market pulse...</p>
            </div>
        );
    }

    const getBadgeStyle = (badge) => {
        switch (badge) {
            case 'Bullish':
                return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'Bearish':
                return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            default:
                return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Live Intelligence Feed</h2>
            {articles.map((article) => (
                <div key={article.id} className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                            <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                {article.source}
                            </span>
                            <span>•</span>
                            <span>{formatDistanceToNow(new Date(article.publish_date), { addSuffix: true })}</span>
                        </div>
                        <span className="text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                            {article.commodity_tag}
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2 leading-tight">
                        {article.title}
                    </h3>

                    {/* AI Summary */}
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                        {article.summary}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${getBadgeStyle(article.impact_badge)}`}>
                            {article.impact_badge}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                            AI Confidence: {article.confidence_score}%
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}

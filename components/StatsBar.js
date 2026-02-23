import { TrendingUp, TrendingDown, Minus, Newspaper } from 'lucide-react';

export default function StatsBar({ stats }) {
    const { totalToday = 0, bullish = 0, bearish = 0, neutral = 0 } = stats || {};

    const cards = [
        {
            title: 'Articles Today',
            value: totalToday,
            icon: <Newspaper size={20} className="text-blue-500" />,
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        },
        {
            title: 'Bullish Signals',
            value: bullish,
            icon: <TrendingUp size={20} className="text-green-500" />,
            bgColor: 'bg-green-50 dark:bg-green-900/20',
        },
        {
            title: 'Bearish Signals',
            value: bearish,
            icon: <TrendingDown size={20} className="text-red-500" />,
            bgColor: 'bg-red-50 dark:bg-red-900/20',
        },
        {
            title: 'Neutral Signals',
            value: neutral,
            icon: <Minus size={20} className="text-gray-500" />,
            bgColor: 'bg-gray-50 dark:bg-gray-800',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {cards.map((card, idx) => (
                <div
                    key={idx}
                    className="flex items-center p-4 border rounded-xl border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm"
                >
                    <div className={`p-3 rounded-lg ${card.bgColor} mr-4`}>
                        {card.icon}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {card.title}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {card.value}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

import ThemeToggle from './ThemeToggle';
import { RefreshCw } from 'lucide-react';

export default function Header({ onRefresh, isRefreshing }) {
    return (
        <header className="flex items-center justify-between py-4 mb-8 border-b border-gray-200 dark:border-gray-800">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                    ChemMarket Intelligence
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Real-time news pulse & sentiment analysis
                </p>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={onRefresh}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                    {isRefreshing ? 'Syncing...' : 'Refresh Now'}
                </button>
                <ThemeToggle />
            </div>
        </header>
    );
}

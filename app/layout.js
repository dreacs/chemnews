import { ThemeProvider } from 'next-themes';
import './globals.css';

export const metadata = {
  title: 'ChemMarket Intel Dashboard',
  description: 'Procurment intelligence for European petrochemical markets.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 min-h-screen`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

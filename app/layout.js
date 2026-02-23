import './globals.css';

export const metadata = {
  title: 'ChemMarket Intel Dashboard',
  description: 'Procurment intelligence for European petrochemical markets.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

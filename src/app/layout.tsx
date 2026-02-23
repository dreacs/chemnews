import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "ChemSignal | Raw Material Price Intelligence",
    description: "Real-time AI-powered market pulse for procurement managers.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body className="min-h-screen bg-slate-900 text-slate-50 font-sans antialiased">
                {children}
            </body>
        </html>
    );
}

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RelayCheck - Webhook Regression Lab',
  description: 'Repeatable webhook scenario tests that verify business outcomes.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col bg-paper font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}

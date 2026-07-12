import type { Metadata } from 'next';
import { NavigationBar } from '@/components/layout/NavigationBar';
import './globals.css';

export const metadata: Metadata = {
  title: 'EcoSphere - ESG Management Platform',
  description: 'Environmental, Social, and Governance Management Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-dark-primary text-slate-100">
        <NavigationBar />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}

import Link from 'next/link';
import './globals.css';
import GamifiedBackground from './GamifiedBackground';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const tabs = [
    { name: 'Dashboard', path: '/', color: 'hover:text-white border-b-2 border-transparent hover:border-white' },
    { name: 'Environmental', path: '/environmental', color: 'hover:text-green-400 border-b-2 border-transparent hover:border-green-400' },
    { name: 'Social', path: '/social', color: 'hover:text-blue-400 border-b-2 border-transparent hover:border-blue-400' },
    { name: 'Governance', path: '/governance', color: 'hover:text-purple-400 border-b-2 border-transparent hover:border-purple-400' },
    { name: 'Gamification', path: '/gamification', color: 'hover:text-orange-400 border-b-2 border-transparent hover:border-orange-400' },
    { name: 'Reports', path: '/reports', color: 'hover:text-gray-300' },
    { name: 'Settings', path: '/settings', color: 'hover:text-gray-300' }
  ];

  return (
    <html lang="en">
      <body className="bg-gray-900 text-gray-100 min-h-screen font-sans">
        <GamifiedBackground>
          {/* Top Header */}
          <header className="px-6 py-4 border-b border-gray-700/50 flex items-center gap-3 backdrop-blur-sm bg-gray-900/50">
            <div className="flex gap-1">
              <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
              <div className="w-4 h-4 bg-yellow-500 rounded-sm"></div>
              <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
            </div>
            <h1 className="text-xl font-semibold tracking-wide">EcoSphere: Dashboard</h1>
          </header>

          {/* Tabbed Navigation */}
          <nav className="px-6 border-b border-gray-700/50 flex gap-6 backdrop-blur-md bg-gray-800/40">
            {tabs.map((tab) => (
              <Link 
                key={tab.name} 
                href={tab.path}
                className={`py-3 px-2 text-sm text-gray-400 transition-all duration-200 ${tab.color}`}
              >
                {tab.name}
              </Link>
            ))}
          </nav>

          {/* Page Content */}
          <main className="p-6 max-w-7xl mx-auto z-10 relative">
            {children}
          </main>
        </GamifiedBackground>
      </body>
    </html>
  );
}
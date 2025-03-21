import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Restaurant Matcher',
  description: 'Find a restaurant you and your friend both love.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <div className="min-h-screen flex flex-col">
          <header className="bg-white shadow-sm py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Link href="/" className="text-blue-600 font-semibold text-lg">
                    Restaurant Matcher
                  </Link>
                </div>
                <nav className="flex space-x-4">
                  <Link href="/create-matching" className="text-gray-600 hover:text-blue-600">
                    Create Matching
                  </Link>
                  <Link href="/join-matching" className="text-gray-600 hover:text-blue-600">
                    Join Matching
                  </Link>
                </nav>
              </div>
            </div>
          </header>
          
          <main className="flex-grow">
            {children}
          </main>
          
          <footer className="bg-white py-4 border-t">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <p className="text-center text-sm text-gray-500">
                © {new Date().getFullYear()} Restaurant Matcher
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

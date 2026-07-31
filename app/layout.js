import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'PROFITFORGE Pro - Market Intelligence & SEO',
  description: 'Real-time market analysis and SEO strategy generator',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {children}
        <Toaster position="top-right" toastOptions={{ style: { background: '#0F172A', color: '#E2E8F0', border: '1px solid #2dd4bf20' } }} />
      </body>
    </html>
  );
}

import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'PROFITFORGE Pro - Market Intelligence',
  description: 'Enterprise-grade market intelligence + SEO optimization platform',
  keywords: 'market intelligence, seo engine, e-commerce, dropshipping, affiliate marketing',
  authors: [{ name: 'PROFITFORGE Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#080B12',
  openGraph: {
    title: 'PROFITFORGE Pro - Market Intelligence',
    description: 'World-class market intelligence + SEO optimization',
    url: 'https://profitforge.com',
    siteName: 'PROFITFORGE Pro',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <div className="pt-16">
          {children}
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 5000,
            style: {
              background: '#0D1117',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '16px',
            },
          }}
        />
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VirtueFit AI - AI-Powered Virtual Try-On Platform',
  description: 'Experience the future of fashion with AI-driven virtual clothing design and 4D try-on technology.',
  keywords: ['AI fashion', 'virtual try-on', '3D clothing', 'AI design', 'virtual wardrobe'],
  openGraph: {
    title: 'VirtueFit AI - AI-Powered Virtual Try-On Platform',
    description: 'Experience the future of fashion with AI-driven virtual clothing design and 4D try-on technology.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-space-black text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}

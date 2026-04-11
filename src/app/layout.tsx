import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SvgGradientDefs } from '@/components/ui/SvgGradientDefs';

export const metadata: Metadata = {
  title: 'かたづけッタ',
  description: '家族間で「掃除・片付け」を報告して、おうちを育てるアプリ',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="font-kaisei">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Kaisei+Decol:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SvgGradientDefs />
        {children}
      </body>
    </html>
  );
}

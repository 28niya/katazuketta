import type { Metadata } from 'next';
import { Kaisei_Decol } from 'next/font/google';
import './globals.css';

const kaiseiDecol = Kaisei_Decol({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'かたづけッタ',
  description: '家族で「掃除・片付け」を共有すると、おうちがさりげなく育っていくアプリ',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={kaiseiDecol.className}>
      <head>
        <link
          href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

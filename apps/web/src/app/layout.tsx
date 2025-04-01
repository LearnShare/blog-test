import type { Metadata } from 'next';

import Provider from '@/components/provider';

import '@/css/globals.css';
import '@/css/reset.scss';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Just another blog system',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <Provider>
        { children }
        </Provider>
      </body>
    </html>
  );
}

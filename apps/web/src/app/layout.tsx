import type {
  Metadata,
  Viewport,
} from 'next';

import Provider from '@/components/provider';

import '@/css/globals.css';
import '@/css/reset.scss';

export const metadata: Metadata = {
  title: {
    template: '%s | Blog',
    default: 'Blog',
  },
  description: 'Just another blog system',
};

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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

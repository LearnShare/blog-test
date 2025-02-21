import React from 'react';

import Header from '../layout/header';

interface HomeLayoutProps {
  children: React.ReactNode;
}

export default function HomeLayout({
  children,
}: HomeLayoutProps) {
  return (
    <div>
      <Header />
      <main className="p-4 max-w-6xl mx-auto">
        { children }
      </main>
    </div>
  );
}

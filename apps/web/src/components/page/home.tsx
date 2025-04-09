import React from 'react';

import Header from '../layout/header';
import Footer from '../layout/footer';

interface HomeLayoutProps {
  children: React.ReactNode;
}

export default function HomeLayout({
  children,
}: HomeLayoutProps) {
  return (
    <div className="min-h-[100vh] relative flex flex-col">
      <Header />
      <main className="p-4 w-full max-w-5xl mx-auto flex-1 flex flex-col">
        { children }
      </main>
      <Footer />
    </div>
  );
}

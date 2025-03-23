import React from 'react';

import WelcomeViews from './views';

export default function PageWelcome() {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-3xl text-center">欢迎来到 BLOG</h2>
      <WelcomeViews />
    </div>
  );
}

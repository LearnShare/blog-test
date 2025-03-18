import React from 'react';
import Link from 'next/link';

import HeaderActions from './actions';

export default function Header() {
  const linkCns = 'block py-1 text-md text-slate-700 hover:underline hover:text-slate-500';

  return (
    <header className="sticky top-0 bg-white/40 backdrop-blur-sm border-b border-b-slate-200">
      <div className="flex gap-12 h-[56px] px-4 py-2 items-center max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold">BLOG</h1>
        <nav className="flex-1">
          <ul className="flex gap-6 justify-end">
            <li>
              <Link
                  href="/"
                  className={ linkCns }>文章</Link>
            </li>
            <li>
              <Link
                  href="/author"
                  className={ linkCns }>作者</Link>
            </li>
            <li>
              <Link
                  href="/data"
                  className={ linkCns }>数据</Link>
            </li>
            <li>
              <Link
                  href="/about"
                  className={ linkCns }>关于</Link>
            </li>
          </ul>
        </nav>
        <HeaderActions />
      </div>
    </header>
  );
}

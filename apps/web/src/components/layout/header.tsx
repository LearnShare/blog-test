import React from 'react';
import Link from 'next/link';

import HeaderActions from './actions';

export default function Header() {
  const linkCns = 'block py-1 text-md text-slate-700 hover:underline hover:text-slate-500';

  return (
    <header className="sticky top-0 bg-white/40 backdrop-blur-sm border-b border-b-slate-200 z-40">
      <div className="flex gap-10 h-[56px] px-4 py-2 items-center max-w-5xl mx-auto
          max-xs:gap-3">
        <Link className="text-2xl font-semibold
            max-xs:text-lg"
            href="/">BLOG</Link>
        <nav className="flex-1">
          <ul className="flex gap-6
              max-xs:gap-1.5">
            <li>
              <Link
                  href="/author"
                  className={ linkCns }>作者</Link>
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

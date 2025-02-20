import React from 'react';

import {
  buttonVariants,
} from '@/components/ui/button';

interface HomeLayoutProps {
  children: React.ReactNode;
}

export default function HomeLayout({
  children,
}: HomeLayoutProps) {
  const linkCns = 'block py-1 text-md text-slate-700 hover:underline hover:text-slate-500';

  return (
    <div>
      <header className="border-b border-b-slate-200">
        <div className="flex gap-12 p-4 max-w-6xl mx-auto">
          <h1 className="text-2xl font-semibold">BLOG</h1>
          <nav className="flex-1">
            <ul className="flex gap-6 justify-end">
              <li>
                <a
                    href="/"
                    className={ linkCns }>文章</a>
              </li>
              <li>
                <a
                    href="/author"
                    className={ linkCns }>作者</a>
              </li>
              <li>
                <a
                    href="/statistics"
                    className={ linkCns }>数据</a>
              </li>
              <li>
                <a
                    href="/about"
                    className={ linkCns }>关于</a>
              </li>
            </ul>
          </nav>
          <div className="flex gap-2">
            <a
                href="/sign-up"
                className={ buttonVariants({
                  variant: 'outline',
                  size: 'sm',
                }) }>注册</a>
            <a
                href="/sign-in"
                className={ buttonVariants({
                  variant: 'default',
                  size: 'sm',
                }) }>登录</a>
          </div>
        </div>
      </header>
      <main>
        { children }
      </main>
    </div>
  );
}

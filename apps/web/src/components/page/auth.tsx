import React from 'react';
import {
  NotebookPen as IconNotebookPen,
  Send as IconSend,
  Share as IconShare,
} from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({
  children,
}: AuthLayoutProps) {
  const liCns = `flex gap-1 items-center
      [&>svg]:hidden text-xs
      md:gap-3 md:[&>svg]:block md:text-base`;

  return (
    <div className="
        flex flex-col h-[100vh]
        md:flex-row">
      <div className="
          py-4 flex gap-4 justify-center items-baseline bg-slate-100
          md:flex-1 md:flex-col md:items-center md:min-w-[300px]">
        <h2 className="
            text-2xl font-semibold text-slate-600
            md:mb-15">BLOG</h2>
        <ul className="
            flex gap-1.5 text-slate-600
            md:flex-col md:gap-8">
          <li className={ liCns }>
            <IconNotebookPen
                strokeWidth={ 1.25 } />
            <h4>撰写</h4>
          </li>
          <li className={ liCns }>
            <IconSend
                strokeWidth={ 1.25 } />
            <h4>发布</h4>
          </li>
          <li className={ liCns }>
            <IconShare
                strokeWidth={ 1.25 } />
            <h4>分享</h4>
          </li>
        </ul>
      </div>
      <main className="px-4 py-6 flex-2 flex justify-center items-center">
        <div className="w-full max-w-[320px]">
          { children }
        </div>
      </main>
    </div>
  );
}

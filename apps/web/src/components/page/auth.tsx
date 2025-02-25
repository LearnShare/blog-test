import React from 'react';
import {
  NotebookPen as IconNotebookPen,
  Send as IconSend,
  Share as IconShare,
  CircleDollarSign as IconCircleDollarSign,
} from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({
  children,
}: AuthLayoutProps) {
  const liCns = 'flex gap-3 items-center';

  return (
    <div className="flex h-[100vh]">
      <div className="flex-1 flex flex-col justify-center items-center min-w-[360px] bg-slate-100">
        <div className="mb-20 text-2xl font-semibold text-slate-600">BLOG</div>
        <ul className="flex flex-col gap-8 text-slate-600">
          <li className={ liCns }>
            <IconNotebookPen
                size={ 24 }
                strokeWidth={ 1.25 } />
            <h4>撰写</h4>
          </li>
          <li className={ liCns }>
            <IconSend
                size={ 24 }
                strokeWidth={ 1.25 } />
            <h4>发布</h4>
          </li>
          <li className={ liCns }>
            <IconShare
                size={ 24 }
                strokeWidth={ 1.25 } />
            <h4>分享</h4>
          </li>
          <li className={ liCns }>
            <IconCircleDollarSign
                size={ 24 }
                strokeWidth={ 1.25 } />
            <h4>获利</h4>
          </li>
        </ul>
      </div>
      <main className="flex-2 flex justify-center items-center">
        <div className="w-[360px]">
          { children }
        </div>
      </main>
    </div>
  );
}

import React from 'react';

import {
  cn,
} from '@/lib/utils';

interface DividerProps {
  className?: string;
  children: React.ReactNode;
}

function Divider({
  className = '',
  children,
}: DividerProps) {
  return (
    <div className={ cn(
        'flex gap-3 items-center text-sm text-slate-400 \
        before:content-[""] \
        before:border-b \
        before:border-gray-300 \
        before:flex-1 \
        after:content-[""] \
        after:border-b \
        after:border-gray-300 \
        after:flex-1',
        className
      ) }>{ children }</div>
  );
}

export default Divider;

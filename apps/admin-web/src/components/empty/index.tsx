import React from 'react';
import {
  Bird as IconBird,
} from 'lucide-react';

import {
  cn,
} from '@/lib/utils';

interface EmptyProps {
  className?: string;
}

function Empty({
  className,
}: EmptyProps) {
  return (
    <div className={ cn(
      'flex flex-col gap-6 p-6 items-center justify-center',
      className,
    ) }>
      <IconBird
          className="text-gray-400"
          size={ 80 }
          strokeWidth={ 1 } />
      <span className="text-sm text-gray-500">没有相关数据</span>
    </div>
  );
}

export default Empty;

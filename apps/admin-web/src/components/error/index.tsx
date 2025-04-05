import {
  Frown as IconFrown,
} from 'lucide-react';

import {
  cn,
} from '@/lib/utils';

interface EmptyProps {
  className?: string;
  message?: string;
}

function Empty({
  className,
  message,
}: EmptyProps) {
  return (
    <div className={ cn(
      'flex flex-col gap-6 items-center justify-center',
      className,
    ) }>
      <IconFrown
          className="text-gray-400"
          size={ 80 }
          strokeWidth={ 1 } />
      <span className="text-sm text-gray-500">{ message || '出错了' }</span>
    </div>
  );
}

export default Empty;

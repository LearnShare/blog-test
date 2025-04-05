import {
  LoaderCircle as IconLoaderCircle,
} from 'lucide-react';

import {
  cn,
} from '@/lib/utils';

interface LoadingProps {
  loading?: boolean;
  className?: string;
}

function Loading({
  loading,
  className,
}: LoadingProps) {
  if (!loading) {
    return;
  }

  return (
    <div className={ cn(
      'flex gap-3 items-center justify-center',
      className,
    ) }>
      <IconLoaderCircle className="animate-spin text-gray-400" />
      <span className="text-sm text-gray-500">加载中</span>
    </div>
  );
}

export default Loading;

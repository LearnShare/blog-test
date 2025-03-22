import React from 'react';
import {
  LoaderCircle as IconLoaderCircle,
} from 'lucide-react';

import {
  Button,
} from '@/components/ui/button';
import {
  cn,
} from '@/lib/utils';

interface LoadMoreProps {
  page: number;
  size: number;
  total: number;
  loading: boolean;
  onPageChange?: (page: number) => void;
  className?: string;
}

function LoadMore({
  page = 1,
  size = 10,
  total = 0,
  loading = false,
  onPageChange,
  className,
}: LoadMoreProps) {
  const totalPage = Math.ceil(total / size);

  if (!total
      || page >= totalPage) {
    return null;
  }

  return (
    <div className={ cn(
      'flex justify-center',
      className,
    ) }>
      <Button
          variant="outline"
          disabled={ loading }
          onClick={ () => onPageChange?.(page + 1) }>
        {
          loading && (
            <IconLoaderCircle className="animate-spin text-gray-400" />
          )
        }
        <span>{ loading ? '加载中' : '加载更多' }</span>
      </Button>
    </div>
  );
}

export default LoadMore;

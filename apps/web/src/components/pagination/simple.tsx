'use client';

import Link from 'next/link';
import {
  usePathname,
} from 'next/navigation';
import {
  ChevronLeft as IconChevronLeft,
  ChevronRight as IconChevronRight,
} from 'lucide-react';

import {
  buttonVariants,
} from '@/components/ui/button';
import {
  cn,
} from '@/lib/utils';

interface SimplePaginationProps {
  page: number;
  size?: number;
  total: number;
  className?: string;
}

function SimplePagination({
  page = 1,
  size = 10,
  total = 0,
  className,
}: SimplePaginationProps) {
  const pathname = usePathname();

  if (!total) {
    return null;
  }

  const totalPage = Math.ceil(total / size);
  const hasPrev = page > 1;
  const hasNext = page < totalPage;

  return (
    <div className={ cn(
      'flex gap-6 items-center justify-center',
      className,
    ) }>
      {
        hasPrev && (
          <Link
              href={ `${pathname}?page=${page - 1}` }
              className={ buttonVariants({
                variant: 'outline',
              }) }>
            <IconChevronLeft />
            <span>上一页</span>
          </Link>
        )
      }
      {
        hasNext && (
          <Link
              href={ `${pathname}?page=${page + 1}` }
              className={ buttonVariants({
                variant: 'outline',
              }) }>
            <span>下一页</span>
            <IconChevronRight />
          </Link>
        )
      }
    </div>
  );
}

export default SimplePagination;

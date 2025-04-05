import {
  ChevronLeft as IconChevronLeft,
  ChevronRight as IconChevronRight,
} from 'lucide-react';

import {
  Button,
} from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PaginationProps {
  page?: number;
  size?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

function Pagination({
  page = 1,
  size = 10,
  total = 0,
  onPageChange,
  className,
}: PaginationProps) {
  if (!total) {
    return null;
  }

  const totalPage = Math.ceil(total / size);

  return (
    <div className={ cn(
      'flex gap-4 items-center justify-center select-none',
      className,
    ) }>
      <Button
          variant="outline"
          size="icon"
          disabled={ page <= 1 }
          onClick={ () => onPageChange?.(page - 1) }>
        <IconChevronLeft />
      </Button>
      <span className="text-sm">{ page } / { totalPage } 页，共 { total } 条</span>
      <Button
          variant="outline"
          size="icon"
          disabled={ page >= totalPage }
          onClick={ () => onPageChange?.(page + 1) }>
        <IconChevronRight />
      </Button>
    </div>
  );
}

export default Pagination;

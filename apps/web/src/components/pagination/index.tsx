import React from 'react';
import {
  ChevronLeft as IconChevronLeft,
  ChevronRight as IconChevronRight,
} from 'lucide-react';

import {
  Button,
} from '@/components/ui/button';

interface PaginationProps {
  page: number;
  size?: number;
  total: number;
  onPageChange?: (page: number) => void;
}

function Pagination({
  page = 1,
  size = 10,
  total = 0,
  onPageChange,
}: PaginationProps) {
  if (!total) {
    return null;
  }

  const totalPage = Math.ceil(total / size);

  return (
    <div className="my-6 flex gap-4 items-center justify-center">
      <Button
          variant="outline"
          size="icon"
          disabled={ page <= 1 }
          onClick={ () => onPageChange?.(page - 1) }>
        <IconChevronLeft />
      </Button>
      <span>{ page } / { totalPage } 页，共 { total } 条</span>
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

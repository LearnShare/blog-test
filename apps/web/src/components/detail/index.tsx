'use client';

import React, {
  useState,
} from 'react';
import {
  ChevronDown as IconChevronDown,
} from 'lucide-react';

import {
  Button,
} from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DetailProps {
  toggle?: (actions: {
    toggle: () => void;
    show: () => void;
    hide: () => void;
    expand: boolean;
  }) => React.ReactElement;
  children: React.ReactNode;
}

export default function Detail({
  children,
}: DetailProps) {
  const [
    expand,
    setExpand,
  ] = useState(false);

  const toggle = () => {
    setExpand((oldValue) => !oldValue);
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-center">
        <Button
            variant="outline"
            size="sm"
            onClick={ () => toggle() }>
          <span>更多信息</span>
          <IconChevronDown
              className={ cn(
                'transition duration-400 ease-out',
                {
                  'rotate-0': !expand,
                  'rotate-180': expand,
                },
              ) } />
        </Button>
      </div>
      <div className={ cn(
        'overflow-hidden transition-all duration-700 ease-out',
        {
          'max-h-[200px] opacity-100': expand,
          'max-h-0 opacity-0': !expand,
        },
      ) }>
        { children }
      </div>
    </div>
  );
}

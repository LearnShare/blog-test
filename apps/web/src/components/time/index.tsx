'use client';

import {
  useState,
  useEffect,
  Suspense,
} from 'react';

import time from '@packages/lib/time';
import { cn } from '@/lib/utils';

export default function Time({
  value,
  className,
}: {
  value?: string;
  className?: string;
}) {
  const [
    mounted,
    setMounted,
  ] = useState(false);
  const [
    relativeTime,
    setRelativeTime,
  ] = useState<string>(value ? `${time.format(value, 'dt-short')}` : '');

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
    }

    if (value) {
      setRelativeTime(time.formatRelative(value));
    }
  }, [
    mounted,
    value,
  ]);

  return (
    <Suspense key={ mounted ? 'local' : 'server' }>
      <time
          suppressHydrationWarning
          dateTime={ value }
          className={ cn(
            'text-sm text-gray-500',
            className,
          ) }>{ relativeTime }</time>
    </Suspense>
  );
}

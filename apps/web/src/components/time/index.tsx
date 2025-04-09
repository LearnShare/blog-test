'use client';

import {
  useState,
  useEffect,
} from 'react';

import time from '@packages/lib/time';
import { cn } from '@/lib/utils';

export default function Time({
  value,
  className,
}: {
  value: Date;
  className?: string;
}) {
  const [
    relativeTime,
    setRelativeTime,
  ] = useState<string>(`${time.formatRelative(value)} UTC`);

  useEffect(() => {
    setRelativeTime(time.formatRelative(value));
  }, [
    value,
  ]);

  return (
    <time
        dateTime={ value }
        className={ cn(
          'text-sm text-gray-500',
          className,
        ) }>{ relativeTime }</time>
  );
}

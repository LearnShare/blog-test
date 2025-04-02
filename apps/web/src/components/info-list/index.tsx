import React from 'react';

import {
  cn,
} from '@/lib/utils';

interface InfoItem {
  label: string;
  value: string;
}

interface InfoListProps {
  list: InfoItem[];
  className?: string;
}

function InfoList({
  list,
  className,
}: InfoListProps) {
  return (
    <ul className={ cn(
      'flex flex-col gap-2 w-[300px]',
      'max-xs:w-full',
      className,
    ) }>
      {
        list.map((item, i) => (
          <li
              key={ i }
              className="flex gap-3 items-top text-sm">
            <span className="w-[20%] text-right text-gray-400">{ item.label }: </span>
            <span className="flex-1">{ item.value }</span>
          </li>
        ))
      }
    </ul>
  );
}

export default InfoList;

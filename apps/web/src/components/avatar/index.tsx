'use client';

import React from 'react';
import Image from 'next/image';

import {
  cn,
} from '@/lib/utils';

interface AvatarProps {
  url: string | undefined | null;
  name?: string;
  width?: number;
  height?: number;
  round?: boolean;
  className?: string;
  onClick?: () => void;
}

function Avatar({
  url,
  name,
  width = 40,
  height = 40,
  round = false,
  className,
  onClick,
}: AvatarProps) {
  return (
    <div
        className={ cn(
          'bg-gray-400 flex items-center justify-center shrink-0 relative',
          className,
        ) }
        style={ {
          width: `${width}px`,
          height: `${height}px`,
          borderRadius: round
              ? '50%'
              : '0px',
        } }
        onClick={ () => onClick?.() }>
      {
        url && (
          <Image
              className="rounded-[50%] object-cover"
              src={ url }
              fill
              alt={ name || '' } />
        )
      }
      {
        name && !url && (
          <span className="text-xl text-white select-none">{ name.substring(0, 1).toUpperCase() }</span>
        )
      }
    </div>
  );
}

export default Avatar;

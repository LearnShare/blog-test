import React from 'react';
import Image from 'next/image';

import {
  cn,
} from '@/lib/utils';

interface AvatarProps {
  url?: string;
  name?: string;
  width?: number;
  height?: number;
  round?: boolean;
  className?: string;
}

function Avatar({
  url,
  name,
  width = 40,
  height = 40,
  round = false,
  className,
}: AvatarProps) {
  return (
    <div
        className={ cn(
          'bg-gray-400 flex items-center justify-center',
          className,
        ) }
        style={ {
          width: `${width}px`,
          height: `${height}px`,
          borderRadius: round
              ? '50%'
              : '0px',
        } }>
      {
        url && (
          <Image
              src={ url }
              width={ width }
              height={ height }
              alt={ name } />
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

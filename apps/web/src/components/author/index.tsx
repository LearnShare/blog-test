import React from 'react';
import Link from 'next/link';

import Avatar from '@/components/avatar';
import { cn } from '@/lib/utils';

interface AuthorCardProps {
  uid: string;
  avatar?: string;
  name: string;
  // email?: string;
  className?: string;
}

function AuthorCard({
  uid,
  avatar,
  name,
  // email,
  className,
}: AuthorCardProps) {
  return (
    <Link
        className={ cn(
          'group flex gap-3 items-center',
          className,
        ) }
        href={ `/author/@${uid}` }>
      <Avatar
          url={ avatar }
          name={ name }
          round />
      <div className="flex flex-col">
        <div className="text-slate-700">{ name }</div>
        <div className="text-sm text-slate-500 underline">@{ uid }</div>
      </div>
    </Link>
  );
}

export default AuthorCard;

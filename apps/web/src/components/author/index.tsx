import React from 'react';
import Link from 'next/link';

import Avatar from '@/components/avatar';
import {
  cn,
} from '@/lib/utils';

interface AuthorCardProps {
  uid: string;
  avatarUrl: string | null;
  name: string;
  link?: boolean;
  className?: string;
}

function AuthorCard({
  uid,
  avatarUrl,
  name,
  link = true,
  className,
}: AuthorCardProps) {
  const content = (
    <>
      <Avatar
          url={ avatarUrl }
          name={ name }
          round />
      <div className="flex-1 flex flex-col truncate">
        <div className="text-slate-700">{ name }</div>
        <div className="text-sm text-slate-500 group-hover:underline">@{ uid }</div>
      </div>
    </>
  );

  if (link) {
    return (
      <Link
          className={ cn(
            'group flex gap-3 items-center',
            className,
          ) }
          href={ `/author/@${uid}` }>
        { content }
      </Link>
    );
  }

  return (
    <div
        className={ cn(
          'flex gap-3 items-center',
          className,
        ) }>
      { content }
    </div>
  );
}

export default AuthorCard;

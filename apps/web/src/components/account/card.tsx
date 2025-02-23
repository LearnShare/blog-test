import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import {
  Account,
} from '@/types/account';

export default function AccountCard({
  id,
  name,
  avatar,
}: Account) {
  return (
    <Link
        href={ `/author/${id}` }
        className="group flex gap-2 items-center">
      {
        avatar && (
          <Image
              src={ avatar }
              width="40"
              height="40"
              alt={ name }
              className="rounded-[50%]" />
        )
      }
      <div className="group-hover:underline">{ name }</div>
    </Link>
  );
}

import React from 'react';

import AuthorInfo from './info';
import AuthorPosts from './posts';

import {
  author,
} from '@packages/lib/sdk/web';

export default async function PageAuthor({
  params,
}: {
  params: Promise<{
    uid: string;
  }>,
}) {
  const {
    uid,
  } = await params;

  const realUid = decodeURIComponent(uid).substring(1);

  const data = await author.getAuthor(realUid);

  return (
    <div>
      <AuthorInfo data={ data } />
      <AuthorPosts id={ data?.id } />
    </div>
  );
}

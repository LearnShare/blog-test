import React, {
  cache,
} from 'react';

import AuthorInfo from './info';
import AuthorPosts from './posts';

import {
  author,
} from '@packages/lib/sdk/web';

const getAuthor = cache(async (uid: string) => await author.getAuthor(uid));

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    uid: string;
  }>
}): Metadata {
  const {
    uid,
  } = await params;

  const realUid = decodeURIComponent(uid).substring(1);

  const data = await getAuthor(realUid);

  return {
    title: data
        ? `${data.name} | 作者`
        : '',
    description: data?.intro,
    authors: [
      {
        name: data?.name,
        url: `/author/@${realUid}`,
      },
    ],
  };
}

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

  const data = await getAuthor(realUid);

  return (
    <div>
      <AuthorInfo data={ data } />
      <AuthorPosts id={ data?.id } />
    </div>
  );
}

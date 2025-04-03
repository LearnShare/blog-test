import React, {
  cache,
} from 'react';
import type { Metadata } from 'next';

import HomeLayout from '@/components/page/home';
import PostDetail from '@/components/post/detail';

import {
  post,
} from '@packages/lib/sdk/web';

const getPost = cache(async (uid: string) => await post.get(uid));

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    uid: string;
  }>
}): Promise<Metadata> {
  const {
    uid,
  } = await params;

  const data = await getPost(uid);

  return {
    title: data?.title,
    description: data?.intro,
    authors: [
      {
        name: data?.author?.name,
        url: data?.author?.uid
            ? `/author/@${data?.author?.uid}`
            : '',
      },
    ],
  };
}

export default async function PagePost({
  params,
}: {
  params: Promise<{
    uid: string;
  }>
}) {
  const {
    uid,
  } = await params;

  const data = await getPost(uid);

  return (
    <HomeLayout>
      <section className="flex-1">
        <PostDetail
            { ...data } />
      </section>
    </HomeLayout>
  );
}

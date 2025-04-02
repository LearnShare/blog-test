import type { Metadata } from 'next';

import AuthorCheck from '../../author-check';
import DraftView from './view';

export const metadata: Metadata = {
  title: '未发布的文章',
  description: '未发布的文章',
};

export default async function PageDraft({
  params,
}: {
  params: Promise<{
    uid: string;
  }>
}) {
  const {
    uid,
  } = await params;

  return (
    <AuthorCheck>
      <DraftView uid={ uid } />
    </AuthorCheck>
  );
}

import type { Metadata } from 'next';

import AuthorCheck from '../../author-check';
import EditView from './view';

export const metadata: Metadata = {
  title: '编辑文章',
  description: '编辑我的文章',
};

export default async function PageEdit({
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
      <EditView uid={ uid } />
    </AuthorCheck>
  );
}

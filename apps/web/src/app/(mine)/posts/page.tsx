import type { Metadata } from 'next';

import AuthorCheck from '../author-check';
import Posts from './posts';

export const metadata: Metadata = {
  title: '我的文章',
  description: '我的全部文章',
};

export default async function PagePosts() {
  return (
    <AuthorCheck>
      <Posts />
    </AuthorCheck>
  );
}

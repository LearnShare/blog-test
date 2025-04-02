import type { Metadata } from 'next';
import Posts from './posts';

export const metadata: Metadata = {
  title: '我的收藏',
  description: '我收藏的文章',
};

export default function PageBookmark() {
  return (
    <Posts />
  );
}

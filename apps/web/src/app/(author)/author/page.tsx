import type { Metadata } from 'next';
import Authors from './authors';

export const metadata: Metadata = {
  title: '作者',
  description: '推荐作者',
};

export default function PageAuthor() {
  return (
    <Authors />
  );
}

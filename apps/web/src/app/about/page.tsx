'use client';

import Content from './content.mdx';

import '@/css/markdown.scss';

export default function PageAbout() {
  return (
    <div
        className="markdown-content">
      <Content />
    </div>
  );
}

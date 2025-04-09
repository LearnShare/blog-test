import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const linkCns = 'underline hover:text-blue-400';

  return (
    <div className="p-4 max-w-5xl mx-auto text-sm text-gray-400 text-center">
      <span>一个博客系统。作者 </span>
      <Link
          href="https://github.com/LearnShare"
          target="_blank"
          className={ linkCns }>LearnShare</Link>
      <span>，代码 </span>
      <Link
          href="https://github.com/LearnShare/blog-test"
          target="_blank"
          className={ linkCns }>GitHub</Link>
    </div>
  );
}

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const linkCns = 'underline hover:text-blue-400';

  return (
    <div className="p-4 max-w-6xl mx-auto text-sm text-gray-400 text-center">
      <span>A blog system, built by </span>
      <Link
          href="https://github.com/LearnShare"
          target="_blank"
          className={ linkCns }>LearnShare</Link>
      <span>, and source code available on </span>
      <Link
          href="https://github.com/LearnShare/blog-test"
          target="_blank"
          className={ linkCns }>GitHub</Link>
    </div>
  );
}

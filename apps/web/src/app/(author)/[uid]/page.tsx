import React from 'react';

import HomeLayout from '@/components/page/home';
import PostCard from '@/components/post/card';

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

  return (
    <HomeLayout>
      <div className="flex justify-between items-center">
        <div className="py-2 flex-col gap-3">
          <h4 className="text-2xl text-slate-800">Username</h4>
          <p className="text-sm text-slate-400">@{uid.substring(3)}</p>
        </div>
        <div className="w-[1px] h-[40px] bg-gray-300"></div>
        <div className="py-2 flex-col gap-3">
          <h4 className="text-2xl text-slate-800">12</h4>
          <p className="text-sm text-slate-400">Posts</p>
        </div>
        <div className="w-[1px] h-[40px] bg-gray-300"></div>
        <div className="py-2 flex-col gap-3">
        <h4 className="text-2xl text-slate-800">2345</h4>
          <p className="text-sm text-slate-400">Visitors</p>
        </div>
      </div>
      <section className="mt-4">
        <div className="flex flex-wrap gap-6 *:flex-1 *:min-w-[400px] *:max-w-[calc(50%-12px)]">
          <PostCard
              id={ 2 }
              cover="/images/2.png"
              title="Next.js - The React Framework for the Web"
              content="Used by some of the world's largest companies, Next.js enables you to create high-quality web applications with the power of React components."
              utime={ new Date('2025-02-21') } />
          <PostCard
              id={ 3 }
              cover="/images/3.png"
              title="Tailwind CSS - Rapidly build modern websites without ever leaving your HTML."
              content="A utility-first CSS framework packed with classes like flex, pt-4, text-center and rotate-90 that can be composed to build any design, directly in your markup."
              utime={ new Date('2025-02-21') } />
          <PostCard
              id={ 4 }
              title="Prisma - Scale faster, build smarter"
              content="Ship production apps at lightning speed, and scale to a global audience effortlessly with our next-gen serverless database."
              utime={ new Date('2025-02-21') } />
          <PostCard
              id={ 5 }
              title="Next.js - The React Framework for the Web"
              content="Used by some of the world's largest companies, Next.js enables you to create high-quality web applications with the power of React components."
              utime={ new Date('2025-02-21') } />
          <PostCard
              id={ 6 }
              title="Tailwind CSS - Rapidly build modern websites without ever leaving your HTML."
              content="A utility-first CSS framework packed with classes like flex, pt-4, text-center and rotate-90 that can be composed to build any design, directly in your markup."
              utime={ new Date('2025-02-21') } />
        </div>
      </section>
    </HomeLayout>
  );
}

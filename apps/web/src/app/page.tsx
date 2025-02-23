import HomeLayout from '@/components/page/home';
import PostCard from '@/components/post/card';

export default function PageHome() {
  return (
    <HomeLayout>
      <section className="mt-4">
        <PostCard
            id={ 1 }
            cover="/images/1.svg"
            title="Prisma - Scale faster, build smarter"
            content="Ship production apps at lightning speed, and scale to a global audience effortlessly with our next-gen serverless database."
            utime={ new Date('2025-02-21') } />
      </section>
      <section>
        <h2 className="text-2xl font-semibold my-4">最近更新</h2>
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

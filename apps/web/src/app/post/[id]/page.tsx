import HomeLayout from '@/components/page/home';
import PostCard from '@/components/post/card';
import PostDetail from '@/components/post/detail';

export default function PagePost() {
  return (
    <HomeLayout>
      <section className="flex-1">
        <PostDetail
            id={ 1 }
            cover="/images/3.png"
            title="Prisma - Scale faster, build smarter"
            content="Ship production apps at lightning speed, and scale to a global audience effortlessly with our next-gen serverless database."
            author={ {
              id: 1,
              email: 'admin@test.com',
              name: 'Admin',
              avatar: '/images/avatar.jpeg',
            } }
            utime={ new Date('2025-02-21') } />
      </section>
      <section className="mt-15">
        <h2 className="text-xl mb-4">推荐文章</h2>
        <div className="flex flex-wrap gap-6 *:flex-1 *:min-w-[400px] *:max-w-[calc(50%-12px)]">
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

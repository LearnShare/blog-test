import React from 'react';

import HomeLayout from '@/components/page/home';
import AuthorCheck from '../author-check';
import PostForm from '@/components/post/form';

export default function PageHome() {
  return (
    <HomeLayout>
      <AuthorCheck>
        <PostForm />
      </AuthorCheck>
    </HomeLayout>
  );
}

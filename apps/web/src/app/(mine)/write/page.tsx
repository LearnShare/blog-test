import React from 'react';

import HomeLayout from '@/components/page/home';
import AuthorCheck from '../author-check';
import PostForm from './form';

export default function PageHome() {
  return (
    <HomeLayout>
      <AuthorCheck>
        <PostForm />
      </AuthorCheck>
    </HomeLayout>
  );
}

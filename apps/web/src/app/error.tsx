'use client';

import HomeLayout from '@/components/page/home';
import Error from '@/components/error';

export default function PageError() {
  return (
    <HomeLayout>
      <Error />
    </HomeLayout>
  );
}

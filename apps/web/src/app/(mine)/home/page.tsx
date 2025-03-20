import React from 'react';

import HomeLayout from '@/components/page/home';
import HomeViews from './views';

export default function PageHome() {
  return (
    <HomeLayout>
      <HomeViews />
    </HomeLayout>
  );
}

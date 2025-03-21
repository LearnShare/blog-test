import React from 'react';

import HomeLayout from '@/components/page/home';
import AuthorCheck from '../author-check';
import DataGrid from './data/grid';
import DataCharts from './data/charts';

export default function PageHome() {
  return (
    <HomeLayout>
      <AuthorCheck>
        <DataGrid />
        <DataCharts />
      </AuthorCheck>
    </HomeLayout>
  );
}

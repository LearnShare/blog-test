import React from 'react';

import HomeLayout from '@/components/page/home';
import DataGrid from './data/grid';
import DataCharts from './data/charts';

export default function PageHome() {
  return (
    <HomeLayout>
      <DataGrid />
      <DataCharts />
    </HomeLayout>
  );
}

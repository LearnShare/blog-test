import React from 'react';

import DataGrid from './data/grid';
import DataCharts from './data/charts';

export default function PageHome() {
  return (
    <>
      <DataGrid />
      <DataCharts />
    </>
  );
}

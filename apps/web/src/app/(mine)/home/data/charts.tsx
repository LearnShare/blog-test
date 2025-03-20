import React from 'react';

import DataPosts from './posts';
import DataStats from './stats';

function DataCharts() {
  return (
    <div className="mt-6 flex gap-6 flex-wrap">
      <DataPosts />
      <DataStats />
    </div>
  );
}

export default DataCharts;

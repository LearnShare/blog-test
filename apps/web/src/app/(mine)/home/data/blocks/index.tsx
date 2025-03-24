import React from 'react';

import DataProfile from './profile';
import DataPosts from './posts';
import DataStats from './stats';

function DataBlocks() {
  return (
    <>
      <div className="mt-6">
        <DataProfile />
      </div>
      <div className="mt-6 flex gap-6 flex-wrap">
        <DataPosts />
        <DataStats />
      </div>
    </>
  );
}

export default DataBlocks;

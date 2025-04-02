import type { Metadata } from 'next';

import React from 'react';

export const metadata: Metadata = {
  title: '个人主页',
  description: '我在 Blog 上的个人主页',
};

import DataGrid from './data/grid';
import DataBlocks from './data/blocks';

export default function PageHome() {
  return (
    <>
      <DataGrid />
      <DataBlocks />
    </>
  );
}
